import { Component } from '@angular/core';
import { AUDIO_PATH, PLAY_AUDIO_ON_REQUEST, DEAL_TIMEOUT, POSITION_INTERVAL, DEAL_STATUS_PENDING } from 'src/environments/environment.prod';
import { AuthService } from '../services/auth.service';

import { Router } from '@angular/router';
import { DriverService } from '../services/driver.service';
import { AlertController, MenuController } from '@ionic/angular';
import { DealService } from '../services/deal.service';
import { PlaceService } from '../services/place.service';
import { TranslateService } from '@ngx-translate/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  map: any;
  driver: any = {};
  deal: any;
  dealSubscription: any;
  isDriverAvailable = false;
  positionTracking: any;
  dealStatus = false;

  public job: any;
  public remainingTime = DEAL_TIMEOUT;

  constructor(
    private driverService: DriverService,
    private alertCtrl: AlertController,
    private dealService: DealService,
    private authService: AuthService,
    private placeService: PlaceService,
    private geolocation: Geolocation,
    private translate: TranslateService,
    private router: Router,
    private storage: Storage,
    private menuCtrl: MenuController
  ) {

  }


  loadMap(lat, lng) {
    let latLng = new google.maps.LatLng(lat, lng);
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: latLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false,
    });
    new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });
  }

  changeAvailability() {
    clearInterval(this.positionTracking);
    console.log(this.isDriverAvailable);
    if (this.isDriverAvailable == true) {
      // get current location
      this.geolocation.getCurrentPosition().then((resp) => {
        let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        let geocoder = new google.maps.Geocoder();

        this.loadMap(resp.coords.latitude, resp.coords.longitude);
        // find address from lat lng
        geocoder.geocode({ 'latLng': latLng }, (results, status) => {
          if (status == google.maps.GeocoderStatus.OK) {
            // save locality
            let locality = this.placeService.setLocalityFromGeocoder(results);
            console.log('locality', locality);

            // start tracking
            this.positionTracking = setInterval(() => {
              // check for driver object, if it did not complete profile, stop updating location
              if (!this.driver || !this.driver.type) {
                return;
              }

              // Periodic update after particular time intrvel
              this.geolocation.getCurrentPosition().then((resp) => {
                console.log(resp);
                this.driverService.updatePosition(this.driver.uid, this.driver.type, locality, resp.coords.latitude, resp.coords.longitude, this.driver.rating, this.driver.name);
              }, err => {
                console.log(err);
              });

            }, POSITION_INTERVAL);


            this.watchDeals();
          }
        });
      }, err => {
        console.log(err);
      });

    }
    else {
      clearInterval(this.positionTracking);
      if (this.dealSubscription) {
        // unsubscribe when leave this page
        this.dealSubscription.unsubscribe();
      }
    }

  }
  ionViewWillLeave() {
    if (this.dealSubscription) {
      // unsubscribe when leave this page
      this.dealSubscription.unsubscribe();
    }
  }

  // count down
  countDown() {
    let interval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime == 0) {
        clearInterval(interval)
        this.cancelDeal();
        this.remainingTime = DEAL_TIMEOUT;
      }
    }, 1000);
    this.confirmJob();
  }

  cancelDeal() {
    console.log("close")
    this.dealStatus = false;
    this.dealService.removeDeal(this.driver.uid);
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true);

    if (this.authService.getUserData() != null) {
      this.driverService.getDriver().valueChanges().subscribe((snapshot: any) => {
        if (snapshot != null) {
          console.log(snapshot);
          this.driver = snapshot;
        }
      });
      this.storage.get('iondriver_settings').then((res: any) => {
        if (res != null && res != undefined) {
          let data = JSON.parse(res);
          this.isDriverAvailable = data.alwaysOn;
        }
      }).catch(err => console.log(err));
    }
    else {
      this.router.navigateByUrl('login');
    }

  }

  range(n) {
    return new Array(Math.round(n));
  }

  // confirm a job
  confirmJob() {
    console.log("confirm");
    let message = "<b>From:</b> (" + this.job.origin.distance + "km)<br/>" + this.job.origin.vicinity + "<br/><br/> <b>To:</b>(" + this.job.destination.distance + "km)<br>" + this.job.destination.vicinity + "";

    this.alertCtrl.create({
      header: 'New Request',
      message: message,
      buttons: [
        {
          text: 'Reject',
          handler: () => {
            console.log('Disagree clicked');
            this.dealStatus = false;
            this.dealService.removeDeal(this.driver.uid);
          }
        },
        {
          text: 'Accept',
          handler: () => {
            this.dealStatus = false;
            this.dealService.acceptDeal(this.driver.uid, this.deal).then(() => {
              this.router.navigateByUrl('pickup');
            });
          }
        }
      ]
    }).then(r => r.present());
    this.playAudio();
  }


  // listen to deals
  watchDeals() {
    // listen to deals
    this.dealSubscription = this.dealService.getDeal(this.driver.uid).valueChanges().subscribe((snapshot: any) => {
      if (snapshot != null || snapshot != undefined) {
        this.deal = snapshot;
        if (snapshot.status == DEAL_STATUS_PENDING) {
          // if deal expired
          if (snapshot.createdAt < (Date.now() - DEAL_TIMEOUT * 1000)) {
            return this.dealService.removeDeal(this.driver.uid);
          }
          this.dealStatus = true;
          console.log(this.dealStatus);


          this.job = snapshot;

          this.geolocation.getCurrentPosition().then((resp) => {
            //resp.coords.longitude
            this.job.origin.distance = this.placeService.calcCrow(resp.coords.latitude, resp.coords.longitude, this.job.origin.location.lat, this.job.origin.location.lng).toFixed(0);
            this.job.destination.distance = this.placeService.calcCrow(resp.coords.latitude, resp.coords.longitude, this.job.destination.location.lat, this.job.destination.location.lng).toFixed(0);
            this.countDown();
          }, err => {
            console.log(err);
          });
        }
      }
    });
  }

  playAudio() {
    if (PLAY_AUDIO_ON_REQUEST == true) {
      let audio = new Audio(AUDIO_PATH);
      audio.play();
    }
  }
}

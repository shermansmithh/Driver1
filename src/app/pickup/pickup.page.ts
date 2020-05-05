import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TripService } from '../services/trip.service';
import { Router } from '@angular/router';
import { DealService } from '../services/deal.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators'
import { AlertController, MenuController } from '@ionic/angular';
import { CommonService } from '../services/common.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.page.html',
  styleUrls: ['./pickup.page.scss'],
})
export class PickupPage implements OnInit {


  trip: any = {};
  passenger: any = {};
  isTripStarted = false;

  constructor(
    private tripService: TripService,
    private alertCtrl: AlertController,
    private dealService: DealService,
    private router: Router,
    private common: CommonService,
    private translate: TranslateService,
    private db: AngularFireDatabase,
    private menuCtrl: MenuController,
    private geolocation: Geolocation
  ) {
    this.menuCtrl.enable(true);
  }

  ngOnInit() { }

  ionViewDidEnter() {
    this.trip = this.tripService.getCurrentTrip();
    let getTrips = this.tripService.getTripStatus(this.trip.key).valueChanges().subscribe((trip: any) => {
      console.log(trip);
      if (trip.status == 'canceled') {
        getTrips.unsubscribe();
        this.tripService.cancel(this.trip.key);
        this.dealService.removeDeal(this.trip.driverId);
        this.common.showAlert("Trip Cancelled");
        this.router.navigateByUrl('/home');
      }
    })
    this.tripService.getPassenger(this.trip.passengerId).valueChanges().pipe(take(1)).subscribe(snapshot => {
      this.passenger = snapshot;
    })
  }


  cancelTrip(){
    let getTrips = this.tripService.getTripStatus(this.trip.key).valueChanges().subscribe((trip: any) => {
      console.log(trip);
    
        getTrips.unsubscribe();
        this.tripService.cancel(this.trip.key);
        this.dealService.removeDeal(this.trip.driverId);
        this.common.showAlert("Trip Cancelled");
        this.router.navigateByUrl('/home');
      
    })
  }
  // pickup
  pickup() {
    this.alertCtrl.create({
      subHeader: "Please Enter OTP from customer",
      inputs: [{
        name: 'otp',
        placeholder: '4 digit OTP'
      }],
      buttons: [{
        text: "Verify",
        handler: (data) => {
          console.log(data);
          this.db.object('trips/' + this.trip.key).valueChanges().pipe(take(1)).subscribe((res: any) => {
            console.log(res);
            if (res.otp != data.otp) this.common.showAlert("Invalid OTP");
            else {
              this.isTripStarted = true;
              this.tripService.pickUp(this.trip.key);
            }
          })
        }
      }]
    }).then(res => res.present());
  }

  getDirection(lat, lng) {
    console.log("call");
    this.geolocation.getCurrentPosition().then(geo => {
      geo.coords.latitude
      let url = "https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=" + geo.coords.latitude + "," + geo.coords.longitude + "&destination=" + lat + "," + lng;
      window.open(url);
    }).catch(err => {
      console.log("Error ");
    })
  }

  showPayment() {
    let final = this.trip.fee - (this.trip.fee * (parseInt(this.trip.discount) / 100))
    this.alertCtrl.create({
      message: '<h1>' + this.trip.currency + ' ' + final + '</h1> <p>Fee: ' + this.trip.fee + ' <br> Discount (%): ' + this.trip.discount + ' (' + this.trip.promocode + ')<br>Payment Method: ' + this.trip.paymentMethod + '</p>',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.tripService.dropOff(this.trip.key);
            this.dealService.removeDeal(this.trip.driverId);
            this.router.navigateByUrl('/home');
          }
        }
      ]
    }).then(res => res.present());
  }
}

import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { TripService } from './services/trip.service';
import { TRIP_STATUS_WAITING, TRIP_STATUS_GOING } from 'src/environments/environment.prod';
import { AngularFireAuth } from '@angular/fire/auth';
import { DriverService } from './services/driver.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Storage } from '@ionic/storage';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Ride History',
      url: '/history',
      icon: 'time'
    },
    {
      title: 'Wallet',
      url: '/wallet',
      icon: 'wallet'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings'
    }

  ];

  positionTracking: any;
  driver: any;
  user: any = {};

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private afAuth: AngularFireAuth,
    private tripService: TripService,
    private driverService: DriverService,
    private authService: AuthService,
    private router: Router,
    private bgmode: BackgroundMode,
    private storage: Storage,
    private common: CommonService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();



      // check for login stage, then redirect
      this.afAuth.authState.subscribe(authData => {
        if (authData) {
          let root: any = 'home';

          // check for uncompleted trip
          this.tripService.getTrips().valueChanges().pipe(take(1)).subscribe((trips: any) => {
            console.log(trips);
            trips.forEach(trip => {
              if (trip.status == TRIP_STATUS_WAITING || trip.status == TRIP_STATUS_GOING) {
                this.tripService.setCurrentTrip(trip.key);
                root = 'pickup';
              }
            });

            this.user = this.authService.getUserData();
            this.driverService.setUser(this.user);
            this.driverService.getDriver().valueChanges().subscribe(snapshot => {
              this.driver = snapshot;
            });

            this.router.navigateByUrl(root)
          });
        } else {
          this.router.navigateByUrl('login');
          this.driver = null;
        }
      });

      this.storage.get('iondriver_settings').then(data => {
        if (data != null && data != undefined) {
          let res = JSON.parse(data);
          if (res.bgmode) this.common.enableBgMode();
          else this.common.disableBgMode();
        }
      });
    });
  }
}

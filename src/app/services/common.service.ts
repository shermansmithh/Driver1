import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController, Platform } from '@ionic/angular';

declare var cordova;

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  loader: any;

  constructor(private toast: ToastController,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private platform: Platform,
  ) { }

  showToast(message) {
    this.toast.create({ message: message, duration: 2000 }).then((res) => {
      res.present();
    });
  }

  showAlert(message) {
    this.alertCtrl.create({
      message: message,
      buttons: ['ok']
    }).then(res => res.present());
  }

  showLoader(message) {
    this.loadCtrl.create({ message: message }).then(res => {
      this.loader = res.present();
      setTimeout(() => this.loadCtrl.dismiss(), 10000);
    });
  }

  hideLoader() {
    this.loadCtrl.dismiss();
  }

  enableBgMode() {
    if (this.platform.is('android') || this.platform.is("ios")) {
      const options = { title: 'Driver App', text: 'Driver App runs Background', hidden: false, silent: true };

      cordova.plugins.backgroundMode.setDefaults(options);
      cordova.plugins.backgroundMode.enable();
      cordova.plugins.backgroundMode.on('enable', () => {
        console.log('background mode activated !!!');
        cordova.plugins.backgroundMode.disableWebViewOptimizations();
        cordova.plugins.backgroundMode.disableBatteryOptimizations();
      });

    } else {
      // this.showToast("Background mode only works on device");
    }

  }

  disableBgMode() {
    cordova.plugins.backgroundMode.disable();
  }

}

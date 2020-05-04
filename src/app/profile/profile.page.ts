import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CUSTOMER_CARE, CURRENCY_SYMBOL, DEFAULT_COUNTRY_CODE, DEFAULT_COUNTRY_MOBILE_CODE } from "../../environments/environment.prod";
import { AuthService } from '../services/auth.service';
import { Platform } from '@ionic/angular';
import { SettingService } from '../services/setting.service';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any = {};
  currency: any;
  support = CUSTOMER_CARE;
  tripCount = 0;
  totalEarning = 0;
  rating: any = 5;
  types: Array<any> = [];
  tabs: any = 'profile';

  constructor(
    private authService: AuthService,
    private settingService: SettingService,
    private common: CommonService,
    private platform: Platform,
    private translate: TranslateService,
    private router: Router,
    private afStorage: AngularFireStorage,
  ) { }

  ngOnInit() {
    // this.user = this.authService.getUser(this.authService.getUserData().uid);
    this.authService.getUser(this.authService.getUserData().uid).valueChanges().pipe(take(1)).subscribe((snapshot: any) => {
      console.log(snapshot);
      this.user = snapshot;
    });

    this.currency = CURRENCY_SYMBOL;
    this.settingService.getVehicleType().pipe(take(1)).subscribe((snapshot: any) => {
      if (snapshot === null) {
        this.settingService.getDefaultVehicleType().pipe(take(1)).subscribe((snapshot: any) => {
          console.log(snapshot);
          this.types = Object.keys(snapshot).map(function (key) {
            return snapshot[key];
          });
        })
      } else {
        this.types = Object.keys(snapshot).map(function (key) {
          return snapshot[key];
        });
      }
    });
    console.log(this.user);
  }

  save() {
    console.log(this.user);
    this.authService.getUser(this.user.uid).update(this.user).then(data => {
      this.common.showToast("Updated successfully");
      this.router.navigateByUrl('/home');
    });
  }
  chooseFile() { document.getElementById('avatar').click(); }

  upload() {
    // Create a root reference
    this.common.showLoader('Uploading..');

    for (let selectedFile of [(<HTMLInputElement>document.getElementById('avatar')).files[0]]) {
      let path = '/users/' + Date.now() + `_${selectedFile.name}`;
      let ref = this.afStorage.ref(path)
      ref.put(selectedFile).then(() => {
        ref.getDownloadURL().subscribe(data => { this.user.photoURL = data; });
        this.common.hideLoader()
      }).catch(err => {
        this.common.hideLoader();
        console.log(err)
      });

    }
  }

  // code for uploading licence image
  chooseDocs() { document.getElementById('docsPDF').click(); }
  uploadDocs() {
    this.common.showLoader('Uploading..');

    for (let selectedFile of [(<HTMLInputElement>document.getElementById('docsPDF')).files[0]]) {
      console.log(selectedFile.name);
      let path = '/users/' + Date.now() + `${selectedFile.name}`;
      let ref = this.afStorage.ref(path);
      ref.put(selectedFile).then(() => {
        ref.getDownloadURL().subscribe(url => this.user.docsURL = url);
        this.common.hideLoader();
      }).catch(err => {
        this.common.hideLoader();
        console.log(err);
      });
    }
  }

  logout() {
    this.authService.logout().then(() => this.router.navigateByUrl('login', { skipLocationChange: true }));
  }

  verifyEmail() {
    this.authService.sendVerification();
  }


}

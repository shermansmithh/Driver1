import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  userInfo: any = {};

  constructor(
    private translate: TranslateService,
    private auth: AuthService,
    private common: CommonService,
    private menuCtrl: MenuController) {

    this.menuCtrl.enable(false);
  }

  ngOnInit() {
  }

  signup() {
    this.auth.register(this.userInfo).subscribe(
      (data) => {
        this.common.showToast("Account Created");
      },
      (err) => {
        this.common.showToast(err.message);
      }
    );
  }
}

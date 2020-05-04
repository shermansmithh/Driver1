import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ENABLE_SIGNUP } from '../../environments/environment.prod'
import { CommonService } from '../services/common.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  userInfo: any = {};
  isRegisterEnabled = ENABLE_SIGNUP;
  constructor(public translate: TranslateService,
    private common: CommonService,
    private auth: AuthService,
    private router: Router,
    private menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
  }

  login() {
    this.auth.login(this.userInfo.email, this.userInfo.password).then(authData => {
      this.router.navigateByUrl('/home');
    }, error => {
      this.common.showToast(error.message);
    });
  }


  reset() {
    if (this.userInfo.email) {
      this.auth.reset(this.userInfo.email)
        .then(data => this.common.showToast('Please Check your inbox'))
        .catch(err => this.common.showToast(err.message));
    }
    else
      this.common.showToast("Please Enter Email Address");
  }
}

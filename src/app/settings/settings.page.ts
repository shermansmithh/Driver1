import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { CommonService } from '../services/common.service';
import { CUSTOMER_CARE } from "../../environments/environment.prod";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  settings: any = {};
  support: any = CUSTOMER_CARE;
  constructor(private translate: TranslateService,
    private storage: Storage,
    private common: CommonService,
  ) { }

  ngOnInit() {
    this.storage.get('iondriver_settings').then(data => {
      if (data != null && data != undefined)
        this.settings = JSON.parse(data);
    })
  }


  save() {

    if (this.settings.bgmode) {
      this.common.enableBgMode();
    }
    else{
      this.common.disableBgMode()
    }
    this.storage.set('iondriver_settings', JSON.stringify(this.settings)).then(data => this.common.showToast("Updated")).catch(err => console.log(err));
  }
}
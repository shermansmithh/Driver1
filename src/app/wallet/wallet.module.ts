import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WalletPage } from './wallet.page';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'angular2-moment';

const routes: Routes = [
  {
    path: '',
    component: WalletPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    MomentModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WalletPage]
})
export class WalletPageModule {}

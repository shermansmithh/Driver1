import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HistoryPage } from './history.page';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'angular2-moment';

const routes: Routes = [
  {
    path: '',
    component: HistoryPage
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
  declarations: [HistoryPage]
})
export class HistoryPageModule { }

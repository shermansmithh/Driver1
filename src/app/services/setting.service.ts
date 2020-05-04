import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { PlaceService } from './place.service';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private db: AngularFireDatabase, private placeService: PlaceService) {}

  getVehicleType() {
    return this.db.object('master_settings/prices/' + this.placeService.getLocality() + '/vehicles').valueChanges();
  }

  getDefaultVehicleType() {
    return this.db.object('master_settings/prices/default/vehicles').valueChanges();
  }
}

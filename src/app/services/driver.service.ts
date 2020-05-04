import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  user: any;

  constructor(private db: AngularFireDatabase, private authService: AuthService) {
    this.user = this.authService.getUserData();
  }

  setUser(user) {
    this.user = user;
  }

  // get driver by id
  getDriver() {
    let user = this.authService.getUserData();
    return this.db.object('drivers/' + user.uid);
  }

  // update driver's position
  updatePosition(vehicleId, vehicleType, locality, lat, lng, rating, name) {
    let path = 'localities/' + locality + '/' + vehicleType + '/' + vehicleId;
    this.db.object(path).valueChanges().pipe(take(1)).subscribe((snapshot: any) => {
      console.log(snapshot);
      // insert if not exists
      if (snapshot === null) {
        this.db.object(path).set({
          key: vehicleId,
          lat: lat,
          lng: lng,
          oldLat: lat,
          oldLng: lng,
          last_active: Date.now(),
          rating: rating,
          name: name
        });

      } else {
        // update
        this.db.object(path).update({
          key: vehicleId,
          lat: lat,
          lng: lng,
          oldLat: snapshot.lat,
          oldLng: snapshot.lng,
          last_active: Date.now(),
          rating: rating,
          name: name
        });
      }
    });
  }
}

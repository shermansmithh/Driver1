import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { TripService } from './trip.service';
import { DEAL_STATUS_ACCEPTED } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DealService {

  constructor(private db: AngularFireDatabase, private tripService: TripService) { }

  getDeal(driverId) {
    return this.db.object('deals/' + driverId);
  }

  removeDeal(driverId) {
    return this.db.object('deals/' + driverId).remove();
  }

  // accept a deal
  acceptDeal(driverId, deal) {
    deal.driverId = driverId;

    // create trip from deal
    return this.tripService.createFromDeal(deal).then((trip) => {

      this.tripService.setCurrentTrip(trip.key);
      // set tripId to deal
      return this.db.object('deals/' + driverId).update({
        status: DEAL_STATUS_ACCEPTED,
        tripId: trip.key
      });
    });
  }
}

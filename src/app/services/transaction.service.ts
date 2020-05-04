import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { TRANSACTION_TYPE_WITHDRAW } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private db: AngularFireDatabase, private authService: AuthService) {}

  getTransactions() {
    let user = this.authService.getUserData();
    console.log(user);
    return this.db.list('transactions', ref => ref.orderByChild('userId').equalTo(user.uid));
  }

  widthDraw(amount: number, balance: number) {
    let user = this.authService.getUserData();
    return this.db.list('transactions/').push({
      userId: user.uid,
      name: user.displayName,
      amount: amount,
      createdAt: Date.now(),
      type: TRANSACTION_TYPE_WITHDRAW,
      status: 'PENDING'
    });
  }
}

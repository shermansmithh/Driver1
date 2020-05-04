import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private db: AngularFireDatabase, private authService: AuthService) {}

  getAll() {
    let user = this.authService.getUserData();
    return this.db.object('reports/' + user.uid);
  }
}

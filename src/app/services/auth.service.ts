import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { EMAIL_VERIFICATION_ENABLED, DEFAULT_AVATAR, DRIVER_INIT_RATING, DRIVER_INIT_BALANCE, APPROVAL_REQUIRED } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) { }

  login(email, pass) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, pass);
  }

  reset(email) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  register(userInfo) {
    console.log(userInfo);
    return Observable.create(observer => {
      this.afAuth.auth.createUserWithEmailAndPassword(userInfo.email, userInfo.password).then((authData: any) => {
        // update driver object
        console.log(authData);
        userInfo.uid = authData.user.uid;
        userInfo.rating = DRIVER_INIT_RATING;
        userInfo.balance = DRIVER_INIT_BALANCE;
        userInfo.photoURL = DEFAULT_AVATAR;
        userInfo.canRide = !APPROVAL_REQUIRED;
        userInfo.isPhoneVerified = false;

        this.getUserData().updateProfile({ displayName: userInfo.name, photoURL: DEFAULT_AVATAR });
        this.db.object('drivers/' + userInfo.uid).update(userInfo);

        if (EMAIL_VERIFICATION_ENABLED === true)
          this.getUserData().sendEmailVerification();
        observer.next();
      }).catch((error: any) => {
        if (error) {
          observer.error(error);
        }
      });
    });
  }

  sendVerification() {
    this.getUserData().sendEmailVerification();
  }

  getUserData() {
    return this.afAuth.auth.currentUser;
  }

  getUser(id) {
    return this.db.object('drivers/' + id);
  }

  logout() {
    return this.afAuth.auth.signOut();   // logout from firebase
  }
}

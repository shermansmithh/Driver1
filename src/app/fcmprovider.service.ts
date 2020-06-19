import { Injectable } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Rx';
import { Platform } from '@ionic/angular';

declare var window

@Injectable({
  providedIn: 'root'
})
export class FcmproviderService {
  userId: any

  constructor(private firebaseX: FirebaseX, public afs: AngularFirestore,  private platform: Platform) { 
    
  }

   // Get permission from the user
   async getToken() {

    let token;
    if (this.platform.is('android')) {

      token = await window.FirebasePlugin.getToken()

    }


    if (this.platform.is('ios')) {
      token = await window.FirebasePlugin.getToken()
      await window.FirebasePlugin.grantPermission();
    }

    return this.saveTokenToFirestore(token)
  }

  

  subribeUIDtoTopic(topic) {
    window.FirebasePlugin.subscribe(topic)
  }

  unsubribeUIDtoTopic(topic) {
    window.FirebasePlugin.unsubscribe(topic)
  }



   // Listen to incoming FCM messages
   listenToNotifications() {

    return new Observable(observer => {
      (window as any).FirebasePlugin.onMessageReceived((response) => {
        observer.next(response);
      });
    });
  }

 // Save the token to firestore
 private saveTokenToFirestore(token) {
  if (!token) return;

  const devicesRef = this.afs.collection('devices')

  const docData = {
    token,
    userId: this.userId
  }

  return devicesRef.doc(token).set(docData)
}

}

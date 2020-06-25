import { Injectable } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Rx';
import { Platform } from '@ionic/angular';
import * as firebase from 'firebase';

declare var window

@Injectable({
  providedIn: 'root'
})
export class FcmproviderService {
  userId: any

  constructor(private firebaseX: FirebaseX, public afs: AngularFirestore,  private platform: Platform ) { 
    
  }

   // Get permission from the user
   async getToken() {
    var vm = this
    let token;
    let token1
    if (this.platform.is('android')) {

 
      token = await vm.firebaseX.getToken()
     
      console.log("TOKEN IS")

      console.log(token)
    }


    if (this.platform.is('ios')) {
      token = await vm.firebaseX.getToken()
  
      await vm.firebaseX.grantPermission();
    }

    return this.saveTokenToFirestore(token)
  }

  

  subribeUIDtoTopic(topic) {
    var vm = this
    console.log("topic")
    vm.firebaseX.subscribe(topic)
  }

  unsubribeUIDtoTopic(topic) {
    var vm = this
    vm.firebaseX.unsubscribe(topic)
  }



  //  // Listen to incoming FCM messages
  //  listenToNotifications() {

  //   return new Observable(observer => {
  //     (window as any).FirebasePlugin.onMessageReceived((response) => {
  //       observer.next(response);
  //     });
  //   });
  // }


  listenToNotifications() {

    var vm = this
   return this.firebaseX.onMessageReceived()
  }

 // Save the token to firestore
 private saveTokenToFirestore(token) {

  if (!token) return;

  const devicesRef = this.afs.collection('devices')
 var userId = firebase.auth().currentUser.uid
 console.log("USERID"+userId)
  const docData = {
    token,
    userId: userId
  }

  return devicesRef.doc(token).set(docData)
}

}

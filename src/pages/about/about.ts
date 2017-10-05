import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AngularFireDatabase,FirebaseListObservable } from 'angularfire2/database';
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
users: FirebaseListObservable<any[]>
  constructor(public navCtrl: NavController, af:AngularFireDatabase ) {
     this.users = af.list('users');
  }

   addUser(name){
     this.users.push( {
        userName:name
     });
   }

}

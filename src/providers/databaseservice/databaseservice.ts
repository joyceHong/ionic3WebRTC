
import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire';
@Injectable()
export class Databaseservice {
   constructor(private _af: AngularFire) {
   }
   publiclistAccounts(): FirebaseListObservable<any[]>{
      return this._af.database.list('/users');
   }
}

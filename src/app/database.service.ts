import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';

export interface SensorData {
  time: Date,
  temp: number,
  hum: number,
  light_b: number,
  light_r: number
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private db: AngularFirestore) { }

  getData(): Observable<SensorData[]> {
    return this.db.collection<SensorData>("fromPycom").valueChanges();
  }

  setSetpoints(temp: number, hum: number, light: number) {
    this.db.collection("setpoints").doc("user").set({
      temp: temp,
      hum: hum,
      light: light
    });
  }

  checkSetPointChanges(): Observable<any> {
    return this.db.collection("setpoints").doc("user").valueChanges();
  }

  getSetPoints(): Observable<any> {
    return Observable.create(observable => {
      this.checkSetPointChanges().subscribe(setpoints => {
        if(isNullOrUndefined(setpoints)) return;
        observable.next(setpoints);
        observable.complete();
      })
    })
  }
}

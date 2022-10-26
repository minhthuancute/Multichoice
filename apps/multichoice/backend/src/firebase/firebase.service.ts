import { Injectable } from '@nestjs/common';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Database, getDatabase, onValue, ref } from 'firebase/database';
import configuration from '../config/configuration';

@Injectable()
export class FirebaseService {
  public app: FirebaseApp;

  public db: Database;

  constructor() {
    this.app = initializeApp(configuration().firebase);
    this.db = getDatabase(this.app);
  }

  public fireGet(path: string, cb: (data: unknown) => void) {
    onValue(ref(this.db, path), (snapshot) => {
      const data = snapshot.val();
      cb(data);
    });
  }

  get(path: string) {
    return new Promise((resolve, reject) => {
      this.fireGet(path, (data) => {
        // console.log(data);
        resolve(data);
      });
    });
  }
}

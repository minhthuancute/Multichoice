import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDn0gyUmlxHUSJUPf-e3pxdARWojvtfBYM',
  authDomain: 'multichoice-9ee7a.firebaseapp.com',
  databaseURL:
    'https://multichoice-9ee7a-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'multichoice-9ee7a',
  storageBucket: 'multichoice-9ee7a.appspot.com',
  messagingSenderId: '196861086410',
  appId: '1:196861086410:web:6978c1d1d9caf409918233',
  measurementId: 'G-LEYHV2FEX8',
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCihCdv7i7wsA83W_enR3xGj9-9s9aVNXo',
  authDomain: 'multichoice-90758.firebaseapp.com',
  projectId: 'multichoice-90758',
  storageBucket: 'multichoice-90758.appspot.com',
  messagingSenderId: '223955823655',
  appId: '1:223955823655:web:c7b02b271460f04640f202',
  measurementId: 'G-C9D2TFYC8Q',
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

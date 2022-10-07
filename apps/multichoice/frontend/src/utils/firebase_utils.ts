import {
  ref,
  get,
  set,
  push,
  remove,
  update,
  onValue,
} from 'firebase/database';
import { db } from '../firebase';

export const fireGet =  (path: string, cb: (data: unknown) => void) => {
  onValue(ref(db, path), (snapshot) => {
    const data = snapshot.val();
    cb(data)
  });
};

export const fireSet = async (path: string, data: unknown) => {
  const response = await set(ref(db, path), data);
  return response;
};

export const firePush = async (path: string, data?: unknown) => {
  const response = await push(ref(db, path), data);
  return response;
};

export const fireUpdate = async (path: string, data: object) => {
  const response = await update(ref(db, path), data);
  return response;
};

export const fireDelete = async (path: string) => {
  const response = await remove(ref(db, path));
  return response;
};

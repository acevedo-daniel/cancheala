// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB5twd57A_Ga0Y3s5RY8wUTSK3GDrZm5wc',
  authDomain: 'cancheala.firebaseapp.com',
  projectId: 'cancheala',
  storageBucket: 'cancheala.appspot.com',
  messagingSenderId: '648569611606',
  appId: '1:648569611606:android:1fa3a93ec935583234a2f7',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

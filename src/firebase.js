import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage'; 

const firebaseConfig = {
  apiKey: "AIzaSyDyKw2CzK-GzKuULUiSHEgAL0kwcFfkFKI",
  authDomain: "committee-management-cba0a.firebaseapp.com",
  databaseURL: "https://committee-management-cba0a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "committee-management-cba0a",
  storageBucket: "committee-management-cba0a.appspot.com",
  messagingSenderId: "282683764681",
  appId: "1:282683764681:web:64e92a9250776eff75c218",
  measurementId: "G-7VECSL0P0S"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const analytics = getAnalytics(firebaseApp);
const storage = getStorage(firebaseApp); // Initialize Firebase Storage


export { auth, firestore, analytics, storage};

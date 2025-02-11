import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API,
  authDomain: "taskmanger-1ffc1.firebaseapp.com",
  projectId: "taskmanger-1ffc1",
  storageBucket: "taskmanger-1ffc1.appspot.com",
  messagingSenderId: "1084542199692",
  appId: "1:1084542199692:web:64ca012d95cb11261158a9",
  measurementId: "G-7WQK81SP9L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBAHLEVgdP816VVqyWJ0Egv2C5s5fHjF0Q",
  authDomain: "mobile-app-7e8d3.firebaseapp.com",
  projectId: "mobile-app-7e8d3",
  storageBucket: "mobile-app-7e8d3.firebasestorage.app",
  messagingSenderId: "821045155173",
  appId: "1:821045155173:web:7438707b5e4c0b68f8bd8c",
  measurementId: "G-WFZY7845CY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Make them globally available for the console script
if (typeof window !== 'undefined') {
  window.auth = auth;
  window.db = db;
}

export default app;
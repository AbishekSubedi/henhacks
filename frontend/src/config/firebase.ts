import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDiICFNxQXXfMKPG9MRPOxEQYn4qBGqFR8",
  authDomain: "henhacks-10c56.firebaseapp.com",
  projectId: "henhacks-10c56",
  storageBucket: "henhacks-10c56.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234567890abcdef",
  databaseURL: "https://henhacks-10c56-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth and Database instances
export const auth = getAuth(app);
export const database = getDatabase(app);

export default app; 
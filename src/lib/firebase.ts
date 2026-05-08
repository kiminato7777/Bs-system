import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAjpp8LTM4nMj3fE0MsHC0N1WTg4QyS_gE",
  authDomain: "bs-system-dc1b8.firebaseapp.com",
  databaseURL: "https://bs-system-dc1b8-default-rtdb.firebaseio.com",
  projectId: "bs-system-dc1b8",
  storageBucket: "bs-system-dc1b8.firebasestorage.app",
  messagingSenderId: "58978138966",
  appId: "1:58978138966:web:ad440c0b63cb4efc84f4f7"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, rtdb, auth, storage };

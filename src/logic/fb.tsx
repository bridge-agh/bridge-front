import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDeOIKiFHm4gk-WWShxmniRKheKplWV1yw",
  authDomain: "bridge-agh.firebaseapp.com",
  projectId: "bridge-agh",
  storageBucket: "bridge-agh.appspot.com",
  messagingSenderId: "218757124988",
  appId: "1:218757124988:web:c76a0f5036baf1310f8af9",
  measurementId: "G-0BXC6JYECZ"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

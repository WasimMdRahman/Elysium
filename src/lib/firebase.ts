
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  "projectId": "studio-7201398695-b4401",
  "appId": "1:440413729334:web:fce155bc251ab1334dde97",
  "apiKey": "AIzaSyDClCmlBIfbDzpAR216H1KPjkCCZpWCV8Y",
  "authDomain": "studio-7201398695-b4401.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "440413729334"
};

// Initialize Firebase
let firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebaseApp;


import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBCbQ4-gMSgEdA2H1Pxlkdh3-Ur8UZX2uY",
  authDomain: "expense-957a0.firebaseapp.com",
  projectId: "expense-957a0",
  storageBucket: "expense-957a0.appspot.com",
  messagingSenderId: "841541554918",
  appId: "1:841541554918:web:54f17a9baebbdca7546127",
  measurementId: "G-YS1FM3K7GD",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };


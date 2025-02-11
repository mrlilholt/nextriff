// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8IlOl56nQ5t96eLuOpvWEpnW2Bg02yFk",
  authDomain: "riffraffdecidersradio.firebaseapp.com",
  projectId: "riffraffdecidersradio",
  storageBucket: "riffraffdecidersradio.firebasestorage.app",
  messagingSenderId: "358384886270",
  appId: "1:358384886270:web:baf1549fc8d342b7bf60af",
  measurementId: "G-BJQW4RZMHL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export { app };

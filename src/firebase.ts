import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAZvtj8913uMPoAV7a5UPyzaOu9Ikqd08s",
  authDomain: "audio-compressor.firebaseapp.com",
  projectId: "audio-compressor",
  storageBucket: "audio-compressor.appspot.com",
  messagingSenderId: "820076167600",
  appId: "1:820076167600:web:7a249c9aa8b2b24d271675",
  measurementId: "G-EQ0J92H7ZQ",
};

export const app = initializeApp(firebaseConfig);

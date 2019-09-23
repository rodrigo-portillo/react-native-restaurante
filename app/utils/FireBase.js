import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyByvUQju3hp8xhLiti-IljtzUPHC1TcxAI",
  authDomain: "restaurante-5fec6.firebaseapp.com",
  databaseURL: "https://restaurante-5fec6.firebaseio.com",
  projectId: "restaurante-5fec6",
  storageBucket: "restaurante-5fec6.appspot.com",
  messagingSenderId: "800430173459",
  appId: "1:800430173459:web:8422944915114135"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);

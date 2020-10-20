import firebase from 'firebase';
require('@firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyBs5LoQ4_jxOmAwnrPArRcLUNmj63fk7BU",
  authDomain: "pocketfull.firebaseapp.com",
  databaseURL: "https://pocketfull.firebaseio.com",
  projectId: "pocketfull",
  storageBucket: "pocketfull.appspot.com",
  messagingSenderId: "962496889405",
  appId: "1:962496889405:web:d1af162302ef7714b86054"
};
  // Initialize Firebase
  
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();

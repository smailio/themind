import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import store from "./store";
import config from "./fireBaseConfig";

function initFirebase() {
  firebase.initializeApp(config);
  firebase
    .auth()
    .signInAnonymously()
    .catch(function(error) {
      console.log("error");
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      // ...
    });

  function setUser(uid) {
    console.log("setUser", uid);
    store.dispatch({ type: "SET_USER", uid });
  }

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      const uid = user.uid;
      console.log("User is signed in." + uid);
      setUser(uid);
    } else {
      console.log("User is signed out.");
    }
  });

  const db = firebase.firestore();
  db.settings({ timestampsInSnapshots: true });
  return { db };
}

const { db } = initFirebase();

export { db };

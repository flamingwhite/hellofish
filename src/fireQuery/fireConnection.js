const { env } = require("../../project.config");
const firebase = require("firebase");

console.log("connection to firebase with env", env);

let config = {
  apiKey: "AIzaSyCOj36XbC1HiadXY54awf4ygrJ2adW5YD0",
  authDomain: "miaocontacts.firebaseapp.com",
  databaseURL: "https://miaocontacts.firebaseio.com",
  projectId: "miaocontacts",
  storageBucket: "miaocontacts.appspot.com",
  messagingSenderId: "979490753402"
};

if (env == "production") {
  config = {
    apiKey: "AIzaSyCR_sxrcsU0LaPC2nDpcZc9uZ7W0yzLlN0",
    authDomain: "miaocontacts-production.firebaseapp.com",
    databaseURL: "https://miaocontacts-production.firebaseio.com",
    projectId: "miaocontacts-production",
    storageBucket: "miaocontacts-production.appspot.com",
    messagingSenderId: "969455618874"
  };
}

firebase.initializeApp(config);

export const signinWithFirebase = (username, password) =>
  firebase.auth().signInWithEmailAndPassword(username, password);
export const signoutWithFirebase = () => firebase.auth().signOut();
export const getFirebase = () => firebase;
export const getFireStorage = () => firebase.storage();
export const getFireStorageRef = () => firebase.storage().ref();
export const getBusinessCardRef = () =>
  firebase
    .storage()
    .ref()
    .child("businessCards");
export const getFireDB = () => firebase.database();

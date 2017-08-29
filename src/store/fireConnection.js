const firebase = require('firebase');

var config = {
	apiKey: "AIzaSyCOj36XbC1HiadXY54awf4ygrJ2adW5YD0",
	authDomain: "miaocontacts.firebaseapp.com",
	databaseURL: "https://miaocontacts.firebaseio.com",
	projectId: "miaocontacts",
	storageBucket: "miaocontacts.appspot.com",
	messagingSenderId: "979490753402"
};

firebase.initializeApp(config);

export const getFirebase = () => firebase;
export const getFireDB = () => firebase.database();
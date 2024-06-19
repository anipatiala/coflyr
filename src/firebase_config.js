import {initializeApp} from 'firebase/app'

import { getAuth } from 'firebase/auth'

import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyC6JEaDW1fm1YjJUpNk-mwJmIQo2phYpK0",
    authDomain: "coflyr-project.firebaseapp.com",
    projectId: "coflyr-project",
    storageBucket: "coflyr-project.appspot.com",
    messagingSenderId: "701048298833",
    appId: "1:701048298833:web:57bba06f97e0f8bd364770",
    measurementId: "G-GMSZMS8JWV"
};

const app = initializeApp(firebaseConfig);

const authentication = getAuth(app);

const firestore = getFirestore(app);

export {authentication, firestore}
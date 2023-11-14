import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

// Get Firebase config settings from environment file
const {
    VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID } = import.meta.env;

// Firebase configuration object
const firebaseConfig = {
    apiKey: VITE_FIREBASE_API_KEY,
    authDomain: VITE_FIREBASE_AUTH_DOMAIN,
    projectId: VITE_FIREBASE_PROJECT_ID,
    storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleEmailSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User signed up:', userCredential.user.uid);
            userCredential.user.uid && navigate('/login');
        } catch (error) {
            console.error('Authentication error:', error.message);
        }
    };

    const handleGoogleSignUp = async () => {
        const db = getFirestore(app);

        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            console.log('User signed up:', result.user.uid);
            
            localStorage.setItem('access_token', result.user.accessToken);
            localStorage.setItem('uid', result.user.uid);

            const accountRef = doc(db, 'accounts', result.user.uid);
            await setDoc(accountRef, {
                uid: result.user.uid,
                email: result.user.email,
                access_token: result.user.accessToken
            })

            result.user.uid && navigate('/dashboard');
        } catch (error) {
            console.error('Authentication error:', error.message);
        }
    };


    return (
        <div>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleEmailSignUp}>Sign Up with Email</button>
            <button onClick={handleGoogleSignUp}>Sign Up with Google</button>
        </div>
    );
}

export default SignUp;

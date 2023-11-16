// src/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

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

function Login() {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const navigate = useNavigate();

    const db = getFirestore(app);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            const user = userCredential.user;
            console.log(user);
            console.log('User logged in:', user.uid);

            localStorage.setItem('access_token', user.accessToken);
            localStorage.setItem('uid', user.uid);

            const accountRef = doc(db, 'accounts', user.uid);

            user.uid && navigate('/dashboard');
        } catch (error) {
            console.error('Error logging in:', error.message);
        }
    };

    const handleGoogleSignUp = async () => {

        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            console.log('User signed up:', result.user.uid);
            result.user.uid && navigate('/dashboard');

            localStorage.setItem('access_token', result.user.accessToken);
            localStorage.setItem('uid', result.user.uid);

            const accountRef = doc(db, 'accounts', result.user.uid);
            await setDoc(accountRef, {
                uid: result.user.uid,
                email: result.user.email,
                access_token: result.user.accessToken
            })
        } catch (error) {
            console.error('Authentication error:', error.message);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit} className="border border-gray-300 p-5 rounded shadow-md w-75 mt-4">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full p-2.5 my-2.5 border border-gray-300 rounded"
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full p-2.5 my-2.5 border border-gray-300 rounded"
                    required
                />
                <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 mb-4">Login</button>
                <button onClick={handleGoogleSignUp} className="w-full py-2.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">Sign In with Google</button>
            </form>
            
        </div>
    );
}

export default Login;

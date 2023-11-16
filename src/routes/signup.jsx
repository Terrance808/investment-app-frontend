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
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const db = getFirestore();

    const handleEmailSignUp = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User signed up:', userCredential.user.uid);

            const accountRef = doc(db, 'accounts', userCredential.user.uid);
            console.log(userCredential.user);
            await setDoc(accountRef, {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                access_token: userCredential.user.accessToken
            });

            userCredential.user.uid && navigate('/login');
        } catch (error) {
            console.error('Authentication error:', error.message);
        }
    };

    const handleGoogleSignUp = async () => {

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
            });

            result.user.uid && navigate('/dashboard');
        } catch (error) {
            console.error('Authentication error:', error.message);
        }
    };


    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1>Sign Up</h1>
            <form onSubmit={handleEmailSignUp} className="border border-gray-300 p-5 rounded shadow-md w-75 mt-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 my-2.5 border border-gray-300 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 my-2.5 border border-gray-300 rounded"
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full p-2.5 my-2.5 border border-gray-300 rounded"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 mb-4">Sign Up with Email</button>
                <button onClick={handleGoogleSignUp} className="w-full py-2.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">Sign Up with Google</button>
            </form>
            
        </div>
    );
}

export default SignUp;

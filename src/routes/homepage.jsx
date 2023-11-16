import { useState } from 'react';
import { Link } from 'react-router-dom';

import reactLogo from '../assets/react.svg';
import viteLogo from '../vite.svg';


function Homepage() {

    return (
        <div className="text-center p-5">
            <header className="p-5">
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="h-10 transition-transform duration-200 hover:scale-110" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="h-10 transition-transform duration-200 hover:scale-110" alt="React logo" />
                </a>
            </header>
        
            <main className="mt-5">
                <h1 className="text-2xl mb-5">Welcome to our Investment App</h1>
                <div className="flex justify-center gap-2.5">
                    <Link to={"/login"}>
                        <button className="px-5 py-2.5 bg-blue-600 text-white rounded cursor-pointer transition-colors duration-200 hover:bg-blue-700">Login</button>
                    </Link>
                    <Link to={"/signup"}>
                        <button className="px-5 py-2.5 bg-blue-600 text-white rounded cursor-pointer transition-colors duration-200 hover:bg-blue-700">Sign Up</button>
                    </Link>
                </div>
            </main>
        </div>
    )
}

export default Homepage;
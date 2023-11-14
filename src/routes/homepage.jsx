import { useState } from 'react';
import { Link } from 'react-router-dom';

import reactLogo from '../assets/react.svg';
import viteLogo from '../vite.svg';


function Homepage() {

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Welcome to our Investment App</h1>

            <Link to={"/login"}>
                <button>Login</button>
            </Link>
            <Link to={"/login"}>
                <button>Sign Up</button>
            </Link>
        </>
    )
}

export default Homepage;
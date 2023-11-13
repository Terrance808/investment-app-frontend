import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Homepage from './routes/homepage.jsx';
import SignUp from './routes/signup.jsx';
import Login from './routes/login.jsx';
import Dashboard from './routes/dashboard.jsx';

import ErrorPage from './routes/error-page.jsx';

import './tailwind.css';


const router = createBrowserRouter([
    {
        path: '/',
        element: <Homepage />,
        errorElement: <ErrorPage />
    },
    {
        path: '/signup',
        element: <SignUp />,
        errorElement: <ErrorPage />
    },
    {
        path: '/login',
        element: <Login />,
        errorElement: <ErrorPage />
    },{
        path: '/dashboard',
        element: <Dashboard />,
        errorElement: <ErrorPage />,
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}></RouterProvider>
    </React.StrictMode>
);

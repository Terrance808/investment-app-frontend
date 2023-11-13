import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ErrorPage from './pages/Error-Page';

const router = createBrowserRouter([
  {
      path: '/',
      element: <Homepage />,
      errorElement: <ErrorPage />
  },
]);

function App() {
  <RouterProvider router={router}></RouterProvider>
  // return (
  //   <RouterProvider router={router}></RouterProvider>
    // <BrowserRouter>
    //   <Routes>
    //     <Route exact path="/" element={<Homepage />} />
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/signup" element={<SignUp />} />
    //   </Routes>
    // </BrowserRouter>
  // );
}

export default App;

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Signup';
import Signin from './Signin';
import { api } from './config';

import Dashboard from './DashboardPages/Dashboard'; 

import Profile from './SidebarPages/Profile';
import Notification from './SidebarPages/Notification';


const App = () => {
  const [auth, setAuth] = useState(null); // Initially null to prevent flashing

  useEffect(() => {
    fetch(`${api}/api/auth/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then(response => {
        if (response.ok) {
          setAuth(true);
          return response.json();
        }
        throw new Error('Failed to verify user');
      })
      .catch(error => {
        setAuth(false);
        console.error('Verify Error:', error);
      });
  }, []); // ✅ Runs only once on mount

  if (auth === null) return <div>Loading...</div>; // ✅ Prevents flashing

  return (
    <div>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} /> 

        <Route path='/notification' element={<Notification/>} /> 
        <Route path='/profile' element={<Profile/>}/> 

        <Route path='/dashboard' element={auth ? <Dashboard /> : <Navigate to='/signin' />} />
        <Route path='/' element={auth ? <Navigate to='/dashboard' /> : <Navigate to='/signin' />} />
      </Routes>
    </div>
  );
};

export default App;

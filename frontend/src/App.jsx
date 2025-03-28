import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Signin from './Signin';
import Signup from './Signup';
import { api } from './config';

import Dashboard from './DashboardPages/Dashboard';
import Forgotpassword from './Forgotpassword';
import Notification from './SidebarPages/Notification';
import Profile from './SidebarPages/Profile';

const App = () => {
  const [auth, setAuth] = useState(null); // ✅ Prevents flashing

  const verifyUser = () => {
    fetch(`${api}/api/auth/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('Failed to verify user');
      })
      .then(() => setAuth(true))
      .catch(error => {
        setAuth(false);
        console.error('Verify Error:', error);
      });
  };

  useEffect(() => {
    verifyUser();
  }, [auth]); // ✅ Runs on mount + when auth changes

  if (auth === null) return <div>Loading...</div>; // ✅ Prevents flashing

  return (
    <div>
      <Routes>
        <Route path='/signup' element={<Signup setAuth={setAuth} />} /> {/* ✅ Pass setAuth */}
        <Route path='/signin' element={<Signin setAuth={setAuth} />} /> {/* ✅ Pass setAuth */}
        <Route path='/forgot' element={<Forgotpassword />} />
        <Route path='/notification' element={<Notification />} />
        <Route path='/profile' element={<Profile />} />

        <Route path='/dashboard' element={auth ? <Dashboard /> : <Navigate to='/signin' />} />
        <Route path='/' element={auth ? <Navigate to='/dashboard' /> : <Navigate to='/signin' />} />
      </Routes>

    </div>
  );
};

export default App;

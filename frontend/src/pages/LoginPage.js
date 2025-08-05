import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { getUser } from '../utils/auth';

export default function LoginPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = user => {
    // Redirect based on role
    if (user.role === 'SuperAdmin') navigate('/dashboard/superadmin');
    else if (user.role === 'Admin') navigate('/dashboard/admin');
    else if (user.role === 'Manager') navigate('/dashboard/manager');
    else if (user.role === 'Asst-Manager') navigate('/dashboard/assistant');
    else navigate('/dashboard/user');
  };

  // If already logged in, redirect
  React.useEffect(() => {
    const user = getUser();
    if (user) handleLogin(user);
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: 'auto', marginTop: 100 }}>
      <LoginForm onLogin={handleLogin} error={error} setError={setError} />
    </div>
  );
}

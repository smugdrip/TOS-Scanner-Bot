import { useState } from 'react';
import Navbar from './Navbar';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Login() {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const login = async() => {
    if (!username || !password) {
      console.log('empty');
      return;
    }
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const { token } = await res.json();
      localStorage.setItem('token', token);
      navigate('/');

    } catch (err) {
      console.error('Submission failed:', err)
    }
  }

  return (
    <>
    <Navbar/>
    <div className="container-fluid">
      <div className="card p-4 w-100">
        <div className="row justify-content-center">
            <h2>Login</h2>
            <form onSubmit={e => {
              e.preventDefault();
              login();
            }}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">Log In</button>
            </form>
        </div>
      </div>
      <p className="mt-2">Don't have an account? <NavLink to="/create-account" end>
        Create one here.</NavLink>
      </p>
    </div>
    </>
  );
}

export default Login;
import { useState } from 'react';
import Navbar from './Navbar';
import { NavLink } from 'react-router-dom';

function CreateAccount() {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const createAccount = async() => {

    if (!username || !password) {
      console.log('empty')
      return
    }

    try {

      const res = await fetch('/api/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const result = await res.json();
      console.log(result.userId);

    } catch (err) {
      console.error('Submission failed:', err)
    }

  }

  return (
    <>
    <Navbar/>
    <div className="container-fluid">

      <div className="card p-4">
        <div className="row justify-content-center">
          <h2>Create Account</h2>
          <form
            onSubmit={e => {
              e.preventDefault();
              createAccount();
            }}
          >
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Create account
            </button>
          </form>
        </div>
      </div>
      <p className="mt-2">Already have an account? <NavLink to="/login" end>
          Log in here.
        </NavLink>
      </p>
    </div>
    </>
  );
}

export default CreateAccount;
import { useState } from 'react';
import Navbar from './Navbar';
import { NavLink } from 'react-router-dom';

function Login() {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async() => {

  }

  return (
    <>
    <Navbar/>
    <div className="container-fluid">

      <div className="card p-4 w-100">

        <div className="row justify-content-center">

            <h2>Login</h2>
            <form>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-primary">Log In</button>
            </form>

        </div>

      </div>

      <p className="mt-2">Don't have an account? <NavLink to="/create-account" end>
        Create one here.
      </NavLink></p>

    </div>
    </>
  );
}

export default Login;
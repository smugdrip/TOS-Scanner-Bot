import { useState } from 'react';
import Navbar from './Navbar';
import { NavLink } from 'react-router-dom';

function CreateAccount() {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const createAccount = async() => {
    
  }

  return (
    <>
    <Navbar/>
    <div className="container-fluid">

      <div class="card p-4">
        <div className="row justify-content-center">
          <h2>Create Account</h2>
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
            <button type="submit" className="btn btn-primary">Create account</button>
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
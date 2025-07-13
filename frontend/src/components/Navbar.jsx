// src/components/Navbar.jsx
import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

function Navbar() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
      } catch (err) {
        console.error('Invalid token');
        setUsername(null);
      }
    } else {
      setUsername(null);
    }
  }, []);

  return (
    <nav className="navbar bg-body-tertiary fixed-top w-100">
      <div className="container-fluid d-flex align-items-center">
        <Link className="navbar-brand mb-0 h1 me-3" to="/">
          TOS-Bot
        </Link>

        <NavLink className="nav-link me-auto" to="/" end>
          Home
        </NavLink>

        {username ? (

          <NavLink className="nav-link" to="/account">
            {username}
          </NavLink>

        ) : (
          <NavLink className="nav-link" to="/login">
            Log In
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

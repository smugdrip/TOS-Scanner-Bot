// src/components/Navbar.jsx
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar bg-body-tertiary fixed-top w-100">
      <div className="container-fluid d-flex align-items-center">
        
        <Link className="navbar-brand mb-0 h1 me-3" to="/">
          TOS-Bot
        </Link>

        <NavLink className="nav-link me-auto" to="/" end>
          Home
        </NavLink>

        <NavLink className="nav-link" to="/login">
          Log In
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;

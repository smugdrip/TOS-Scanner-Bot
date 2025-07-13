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

    <nav className="navbar navbar-expand-md bg-body-tertiary fixed-top w-100">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          TOS-Bot
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/popular" end>
                Popular
              </NavLink>
            </li>

          </ul>
          <ul className="navbar-nav ms-md-auto">

            <li className="nav-item">
              {username ? (

                <NavLink className="nav-link" to="/account">
                  {username}
                </NavLink>

              ) : (
                <NavLink className="nav-link" to="/login">
                  Log In
                </NavLink>
              )}
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

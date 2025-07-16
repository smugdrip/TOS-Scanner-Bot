import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import Audits from '../components/Audits'

function Account() {

  const navigate = useNavigate();
  const [audits, setAudits] = useState([]);
  const [username, setUsername] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      setUsername(jwtDecode(token).username);
      try {
        console.log('Fetching audits by user.')
        const res = await fetch('/api/tos-by-user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        setAudits(data.audits);
      } catch (err) {
        console.log(err.message);
      }
    })();
  }, []);

  return(
    <>
    <Navbar/>
    <div className="container-fluid g-0">
      <div className="row mt-5">
        <div className="col">
          <h1>
            hello {username}!
          </h1>
          <button type="button" className="btn btn-danger my-4" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <h3>
        your submitted audits:
      </h3>

      <Audits audits={audits}/>

      

    </div>
    </>
  )
}

export default Account;
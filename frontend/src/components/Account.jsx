import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";


function Account() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return(
    <>
    <Navbar/>
    <div className="container-fluid">
      <div className="row">
        <div className="card p-4">
          <h1>
            hello world
          </h1>
        </div>
        <button type="button" className="btn btn-danger mt-5" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
    </>
  )
}

export default Account;
import Navbar from "./Navbar";

function Popular() {
  return(
    <>
    <Navbar/>
    <div className="container-fluid">
      <div className="row">
        <div className="card p-4">
          <h1>
            most popular privacy policies
          </h1>
        </div>
      </div>
    </div>
    </>
  );
}

export default Popular;
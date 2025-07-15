import Navbar from './Navbar';

export default function Test() {
  return (
    <>
      <Navbar />
      <div
        className="card w-100 bg-light border-dark"
        style={{ minWidth: '80vw' }}
      >
        <h1 className="m-0 p-2 text-center">full-width card</h1>
      </div>
    </>
  );
}

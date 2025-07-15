import Navbar from './Navbar';

function Test() {
  return(
    <>
    <Navbar/>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="card">
            .col-9
          </div>
        </div>
        <div class="col-4">.col-4<br/>Since 9 + 4 = 13 &gt; 12, this 4-column-wide div gets wrapped onto a new line as one contiguous unit.</div>
        {/* <div class="col-6">.col-6<br/>Subsequent columns continue along the new line.</div> */}
      </div>
    </div>
    </>
  );
}

export default Test;
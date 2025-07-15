import Navbar from "./Navbar";
import { useState, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import Audits from "./Audits";

function Best() {

  const [offset, setOffset]  = useState(0);
  const [audits, setAudits]  = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchAudits = async (curOffset) => {
    try {
      console.log('Fetching audits at offset:', curOffset);
      const res = await fetch(`/api/tos-by-desc-score?start_idx=${curOffset}`);
      const { audits: rows, has_more } = await res.json();
      setAudits(rows);
      setHasMore(has_more);
    } catch(err) {
      console.error(err);
    }

  }

  const loadNext = () => {
    const newOffset = offset + 10;
    setOffset(newOffset);
    fetchAudits(newOffset);
  }

  const loadPrev = () => {
    const newOffset = offset - 10;
    setOffset(newOffset);
    fetchAudits(newOffset);
  }

  // initial load
  useEffect(() => { fetchAudits(0); }, []);

  return(
    <>
    <Navbar/>
    <div className="container-fluid g-0">
      <div className="row">
        <h1 className="my-5">
          highest rated privacy terms
        </h1>
      </div>

      <Audits audits={audits}/>

      <div className="row">
        <div className="col">
          <button className="btn btn-primary mt-4 p-2 me-2" style={{width: '110px'}} disabled={offset === 0} onClick={loadPrev} >
            <strong>{'<< '}</strong>Previous
          </button>
          <button className="btn btn-primary mt-4 p-2 ms-2" style={{width: '110px'}} disabled={!hasMore} onClick={loadNext}>
            Next<strong>{' >>'}</strong>
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
export default Best;
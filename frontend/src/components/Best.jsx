import Navbar from "./Navbar";
import { useState, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

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
      <div className="row">
        <div className="col">

        <div className="card" style={{minWidth: "89vw"}}>
          <div className="accordion m-2 " id="tosAccordion">
            {audits.map((a, idx) => (
              <div key={a.id} className="accordion-item">
                <h2 className="accordion-header" id={`heading-${a.id}`}>
                  <button
                    className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${a.id}`} aria-expanded="false" aria-controls={`collapse-${a.id}`}>
                    <span className="fw-semibold">{a.product_desc}</span>
                    <h5 className="ms-auto">
                      {a.company_name} &nbsp;|{' '}
                      Score: {a.audit_score ?? '—'} &nbsp;|
                      {' '}{new Date(a.created_at).toLocaleString()} &nbsp;
                    </h5>
                  </button>
                </h2>
                <div id={`collapse-${a.id}`} className="accordion-collapse collapse" aria-labelledby={`heading-${a.id}`} data-bs-parent="#tosAccordion">
                  <div className="accordion-body">
                    <h6 className="fw-bold">Product Description</h6>
                    <p className="bg-light p-0 rounded small">{a.description}</p>
                    <div className="accordion" id="accordionTos">
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTos" aria-expanded="false" aria-controls="collapseTos">
                            Submitted TOS text
                          </button>
                        </h2>
                        <div id="collapseTos" className="accordion-collapse collapse hide" data-bs-parent="#accordionTos">
                          <div className="accordion-body">
                            <p className="bg-light p-0 rounded small text-start">{a.tos_text}</p>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAudit" aria-expanded="false" aria-controls="collapseAudit">
                            Generated Audit
                          </button>
                        </h2>
                        <div id="collapseAudit" className="accordion-collapse collapse hide" data-bs-parent="#accordionAudit">
                          <div className="accordion-body">
                              <div className="audit-body">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                                  {a.audit_text}
                                </ReactMarkdown>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      </div>
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
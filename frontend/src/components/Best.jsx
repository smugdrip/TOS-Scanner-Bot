import Navbar from "./Navbar";
import { useState, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

function Best() {

  const [offset, setOffset]  = useState(0);
  const [audits, setAudits]  = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchAudits = useCallback(async (nextOffset = 0) => {
    console.log('Fetching best audits.');
    try {
      const res = await fetch(`/api/tos-by-desc-score?start_idx=${nextOffset}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const { audits: rows, has_more } = await res.json();

      setAudits(prev =>
        nextOffset === 0 ? rows : [...prev, ...rows]
      );
      setHasMore(has_more);
      setOffset(nextOffset);
    } catch (err) {
      console.error('Fetch audits failed:', err);
    }
  }, []);

  // initial load
  useEffect(() => { fetchAudits(0); }, [fetchAudits]);

  return(
    <>
    <Navbar/>
    <div className="container-fluid">
      <div className="row">
        <div className="card p-2 my-4">
          <h1>
            highest rated privacy terms
          </h1>
        </div>
      </div>
      <div className="row">

        <div className="card p-2">
          <div className="accordion mt-3" id="tosAccordion">
            {audits.map((a, idx) => (
              <div key={a.id} className="accordion-item">
                <h2 className="accordion-header" id={`heading-${a.id}`}>
                  <button
                    className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${a.id}`} aria-expanded="false" aria-controls={`collapse-${a.id}`}>
                    <span className="fw-semibold me-2">{a.product_desc}</span>
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
                    <p className="bg-light p-2 rounded small">{a.description}</p>
                    <div className="accordion" id="accordionTos">
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTos" aria-expanded="false" aria-controls="collapseTos">
                            Submitted TOS text
                          </button>
                        </h2>
                        <div id="collapseTos" className="accordion-collapse collapse hide" data-bs-parent="#accordionTos">
                          <div className="accordion-body">
                            <p className="bg-light p-2 rounded small text-start">{a.tos_text}</p>
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
    </>
  );
}
export default Best;
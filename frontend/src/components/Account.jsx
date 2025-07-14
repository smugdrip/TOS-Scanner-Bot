import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

function Account() {

  const navigate = useNavigate();
  const [audits, setAudits] = useState([]);
  const [username, setUsername] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {

    (async () => {
      const token = localStorage.getItem('token');
      setUsername(jwtDecode(token).username);
      try {
        const res = await fetch('/api/tos-by-user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        setAudits(data.audits);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  return(
    <>
    <Navbar/>
    <div className="container-fluid">
      <div className="row">
        <h1>
          hello {username}!
        </h1>
        <button type="button" className="btn btn-danger my-4" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="row">
        <div className="card p-2">
          <h1>
            Your TOS submissions:
          </h1>
          <div className="accordion mt-3" id="tosAccordion">
            {audits.map((a, idx) => (
              <div key={a.id} className="accordion-item">
                <h2 className="accordion-header" id={`heading-${a.id}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${a.id}`}
                    aria-expanded="false"
                    aria-controls={`collapse-${a.id}`}
                  >
                    <span className="fw-semibold me-2">{a.product_desc}</span>
                    <h5 className="ms-auto">
                      {a.company_name} &nbsp;|{' '}
                      Score: {a.audit_score ?? '—'} &nbsp;|
                      {' '}{new Date(a.created_at).toLocaleString()} &nbsp;
                    </h5>
                  </button>
                </h2>
                <div
                  id={`collapse-${a.id}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading-${a.id}`}
                  data-bs-parent="#tosAccordion"
                >
                  <div className="accordion-body">
                    <h6 className="fw-bold">Product Description</h6>
                    <p className="bg-light p-2 rounded small">{a.description}</p>
                    <div class="accordion" id="accordionTos">
                      <div class="accordion-item">
                        <h2 class="accordion-header">
                          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTos" aria-expanded="false" aria-controls="collapseTos">
                            Submitted TOS text
                          </button>
                        </h2>
                        <div id="collapseTos" class="accordion-collapse collapse hide" data-bs-parent="#accordionTos">
                          <div class="accordion-body">
                            <p className="bg-light p-2 rounded small text-start">{a.tos_text}</p>
                          </div>
                        </div>
                      </div>
                      <div class="accordion-item">
                        <h2 class="accordion-header">
                          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAudit" aria-expanded="false" aria-controls="collapseAudit">
                            Generated Audit
                          </button>
                        </h2>
                        <div id="collapseAudit" class="accordion-collapse collapse hide" data-bs-parent="#accordionAudit">
                          <div class="accordion-body">
                            <div className="scroll-x">
                            <div className="audit-body">

                                              <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                rehypePlugins={[rehypeSanitize]}
                                              >
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Account;
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { memo } from 'react';

function Audits( {audits = [] } ) {

  return(
    <div className="container-fluid">
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
    </div>

      
  );
}

export default memo(Audits);
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

export default memo(function Audits({ audits = [] }) {
  return (
<section className="container-fluid">
  <div className="row">
    <div className="col">
      <div className="accordion" id="tosAccordion">
        {audits.map(a => <AccordionItem key={a.id} audit={a} />)}
      </div>
    </div>
  </div>
</section>
  );
});

function ScoreBadge({ score }) {
  const variant =
    score >= 75 ? 'success'
    : score >= 50 ? 'warning'
    : 'danger';

  return (
    <span className={`badge bg-${variant}`}>
      {score ?? '—'}
    </span>
  );
}

function AccordionItem({ audit: a }) {
  const tosCollapseId   = `collapse-tos-${a.id}`;
  const auditCollapseId = `collapse-audit-${a.id}`;

  return (
    <div className="accordion-item rounded shadow-sm">

      <h2 className="accordion-header" id={`heading-${a.id}`}>
        <button
          className="accordion-button collapsed d-flex gap-1
                    align-items-start text-start"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse-${a.id}`}
          aria-expanded="false"
          aria-controls={`collapse-${a.id}`}
        >

          <span className="fw-semibold">{a.product_desc}</span>

          <small
            className="text-body-secondary d-flex w-100 flex-wrap
                      justify-content-between align-items-center"
          >

            <span>{a.company_name}</span>

            <span className="me-3">
              Score&nbsp;<ScoreBadge score={a.audit_score} />&nbsp;|&nbsp;
              {new Date(a.created_at).toLocaleString()}
            </span>
          </small>
        </button>
      </h2>
      <div
        id={`collapse-${a.id}`}
        className="accordion-collapse collapse"
        aria-labelledby={`heading-${a.id}`}
        data-bs-parent="#tosAccordion">

        <div className="accordion-body">
          <h6 className="fw-bold mb-2">Product Description</h6>
          <p className="bg-light border rounded p-2 small">{a.description}</p>

          <div className="accordion mt-3" id={`accordion-nested-${a.id}`}>

            <NestedItem
              id={tosCollapseId}
              parent={a.id}
              title="Submitted TOS text">
              <p className="bg-light border rounded small text-start">
                {a.tos_text}
              </p>
            </NestedItem>

            <NestedItem
              id={auditCollapseId}
              parent={a.id}
              title="Generated Audit">
              <div className="audit-body text-start">
                <ReactMarkdown>
                  {a.audit_text}
                </ReactMarkdown>
              </div>
            </NestedItem>
          </div> 
        </div>
      </div>
    </div>
  );
}

function NestedItem({ id, parent, title, children }) {
  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${id}`}
          aria-expanded="false"
          aria-controls={id}>
          {title}
        </button>
      </h2>
      <div
        id={id}
        className="accordion-collapse collapse"
        data-bs-parent={`#accordion-nested-${parent}`}>
        <div className="accordion-body p-3">
          {children}
        </div>
      </div>
    </div>
  );
}

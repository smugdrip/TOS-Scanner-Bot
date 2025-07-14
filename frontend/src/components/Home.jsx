import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './Navbar'
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

function Home() {
  
  const [tosText, setTosText] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [audit, setAudit] = useState('');
  const [auditScore, setAuditScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmitTos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submit-tos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
         },
        body: JSON.stringify({ tos: tosText, company_name: companyName, description: productDesc }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const result = await res.json()
      setAudit(result.audit);
      setAuditScore(result.score);
    } catch (err) {
      console.error('Submission failed:', err)
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <Navbar />
    {loading && (
      <div className="loading-overlay">
        <div className="text-center">
          <h1>Loading…</h1>
          <div className="spinner-border" role="status"></div>
        </div>
      </div>
    )}
    <div id="main" className={loading ? 'blur' : ''}>
      <div className="container-fluid">
        <div className="card p-4 my-5">
          <div className="row">
            <div className="col">
              <h1>Welcome to AI Data Terms Summarizer</h1>
              <p>
                This tool helps users understand how their data is used and flags
                any unethical practices.
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="row text-start">
            <div className="col">
              <form onSubmit={e => e.preventDefault()}>
                <div className="mb-4">
                  <label for="companyNameInput" className="form-label h4">
                    Enter company name:
                  </label>
                  <input type="text" className="form-control mb-4" id="companyNameInput" aria-describedby="companyName" onChange={e => setCompanyName(e.target.value)}/>
                  <label for="productDescInput" className="form-label h6">
                    Enter a brief description of the product the TOS was made for:
                  </label>
                  <textarea rows={5} className="form-control mb-4" id="productDescInput" aria-describedby="companyName" onChange={e => setProductDesc(e.target.value)}/>
                  <label htmlFor="tosInput" className="form-label h4">
                    Paste TOS Here:
                  </label>
                  <textarea id="tosInput" className="form-control" rows={13} onChange={e => setTosText(e.target.value)}/>
                </div>
                <button type="button" className="btn btn-primary" onClick={handleSubmitTos}>
                  Submit for Audit
                </button>
              </form>
            </div>
          </div>
        </div>

        {audit && (
          <div className="card p-4 mt-5">
            <div className="row mt-4">
              <div className="col">
                <h1>Results:</h1>
                <div className="card p-4 my-4">
                  <h2>
                    Audit Score: {auditScore}/100
                  </h2>
                </div>
                <article className="prose lg:prose-lg mt-6">
                  <div className="audit-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                      {audit}
                    </ReactMarkdown>
                  </div>
                </article>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
export default Home;
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './Navbar'
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

function Home() {
  
  const [tosText, setTosText] = useState('');
  const [audit, setAudit] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitTos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submit-tos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tos: tosText }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const result = await res.json()
      setAudit(result.audit);
    } catch (err) {
      console.error('Submission failed:', err)
    } finally {
      setLoading(false);
    }
  };

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
      <div className="container-fluid py-5">
        <div className="card p-4 mb-5">
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
          <div className="row">
            <div className="col">
              <form onSubmit={e => e.preventDefault()}>
                <div className="mb-4">
                  <label htmlFor="tosInput" className="form-label h3">
                    Paste TOS Here:
                  </label>
                  <textarea
                    id="tosInput"
                    className="form-control"
                    rows={10}
                    onChange={e => setTosText(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitTos}
                >
                  Submit for Audit
                </button>
              </form>
            </div>
          </div>
        </div>

        {audit && (
          <div className="card p-4 mt-5">
            <div className="row">
              <div className="col">
                <h1>Results:</h1>
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
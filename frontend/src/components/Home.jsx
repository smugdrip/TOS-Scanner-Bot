import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

function Home() {
  const [tosText, setTosText] = useState('')

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/tos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tos: tosText }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const result = await res.json()
      console.log('Saved!', result)
    } catch (err) {
      console.error('Submission failed:', err)
    }
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h1>Welcome to AI Data Terms Summarizer</h1>
          <p>
            This tool helps users understand how their data is used and flags
            any unethical practices.
          </p>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col">
          <form onSubmit={e => e.preventDefault()}>
            <div className="mb-3">
              <label htmlFor="tosInput" className="form-label h3">
                Paste TOS Here:
              </label>
              <textarea
                id="tosInput"
                className="form-control"
                rows={10}
                value={tosText}
                onChange={e => setTosText(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleSubmit}
            >
              Submit for Assessment
            </button>
          </form>
        </div>
      </div>

      <hr />

      <div className="row">
        <div className="col">
          <h1>Results:</h1>
          {/* render backend response here */}
        </div>
      </div>
    </div>
  )
}

export default Home

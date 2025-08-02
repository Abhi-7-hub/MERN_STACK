import React, { useState } from 'react'
import axios from 'axios'

const GeminiHome = () => {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchGeminiResponse = async () => {
    if (!input.trim()) return
    setLoading(true)

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY

      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: input }] }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.'
      setResponse(text)
    } catch (error) {
      setResponse('Something went wrong. ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen p-6 sm:p-10 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Gemini AI Search</h1>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={fetchGeminiResponse}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>

        {response && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg whitespace-pre-line">
            {response}
          </div>
        )}
      </div>
    </div>
  )
}

export default GeminiHome

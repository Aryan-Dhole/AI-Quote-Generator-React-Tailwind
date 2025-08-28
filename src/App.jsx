import { useState, useEffect } from 'react'

function App() {
  const [quote, setQuote] = useState("")
  const [loading, setLoading] = useState(false);
  const [displayedQuote, setDisplayedQuote] = useState(""); // for typewriter

  const generateQuote = async () => {
    setLoading(true)
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: 'system', content: "You are a motivational Quote Generator" },
            { role: "user", content: "Give me a one short inspirational Quote" }
          ]
        })
      })

      const data = await res.json()
      const newQuote = data.choices[0].message.content.trim()
      setQuote(newQuote)
      setDisplayedQuote("") // reset before typing
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Typewriter effect
  useEffect(() => {
    if (quote) {
      let i = 0
      const interval = setInterval(() => {
        setDisplayedQuote(prev => prev + quote.charAt(i))
        i++
        if (i >= quote.length) clearInterval(interval)
      }, 50) // speed (ms per character)
      return () => clearInterval(interval)
    }
  }, [quote])

  return (
    <div className='min-h-screen bg-gray-900 text-white p-12'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold mb-16'>Quote Generator</h1>
        <h2 className='text-md font-thin italic text-gray-400 mb-6'>
          Press the button below to generate Quote.
        </h2>
        <button
          className='bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition'
          onClick={generateQuote}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Quote"}
        </button>
      </div>

      <div className="bg-gray-700 p-6 rounded-lg shadow-md max-w-xl mx-auto my-18 text-center relative">
        {displayedQuote ? (
          <p className="text-lg font-medium mb-8">"{displayedQuote}</p>
        ) : (
          <p className="text-lg text-gray-300 italic" id="quote-text">
            "Your AI-generated quote will appear here."
          </p>
        )}
      </div>
    </div>
  )
}

export default App

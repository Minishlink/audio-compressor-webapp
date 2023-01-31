import { useState } from 'react'
import './App.css'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Audio compressor</h1>
      <div className="card">
        <p>
          Compress your audio files locally on browser
        </p>
      </div>
    </div>
  )
}


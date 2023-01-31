import { useState } from "react";
import "./App.css";

export function App() {
  const [file, setFile] = useState<File | undefined>();

  return (
    <div className="App">
      <h1>Audio compressor</h1>
      <div className="card">
        <p>Compress your audio files locally on browser</p>
        <input
          type="file"
          accept="audio/*"
          onChange={(event) => setFile(event.target.files?.[0])}
        />
        {!!file && (
          <>
            <div id="player-container">
              <audio controls src={URL.createObjectURL(file)}></audio>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

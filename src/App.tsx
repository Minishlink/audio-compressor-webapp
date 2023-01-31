import { useCallback, useState } from "react";
import "./App.css";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({ log: true });

export function App() {
  const [file, setFile] = useState<File | undefined>();
  const [output, setOutput] = useState<
    { url: string; name: string } | undefined
  >();

  const compress = useCallback(async () => {
    if (!file) {
      return;
    }

    const { name } = file;
    await ffmpeg.load();
    ffmpeg.FS("writeFile", name, await fetchFile(file));
    const outputFilename = `compressed_${Date.now()}_${name}`;
    await ffmpeg.run("-i", name, outputFilename);
    const data = ffmpeg.FS("readFile", outputFilename);
    setOutput({
      url: URL.createObjectURL(new Blob([data.buffer], { type: "audio/m4a" })),
      name: outputFilename,
    });
  }, [file]);

  return (
    <div className="App">
      <h1>Audio compressor</h1>
      <div className="card">
        <p>Compress your audio files locally on browser</p>
        <input
          type="file"
          accept="audio/*"
          onChange={(event) => {
            setFile(event.target.files?.[0]);
            setOutput(undefined);
          }}
        />
        {!!file && (
          <>
            <div className="player-container">
              <audio controls src={URL.createObjectURL(file)} />
            </div>
            <button onClick={compress}>Compress</button>
          </>
        )}
        {!!output && (
          <div>
            <h2>Result</h2>
            <div className="player-container">
              <audio controls src={output.url} />
            </div>
            <a href={output.url} download={output.name}>
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

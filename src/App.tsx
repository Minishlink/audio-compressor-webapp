import { useCallback, useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { getAnalytics, logEvent } from "firebase/analytics";
import { app as firebaseApp } from "./firebase";
import "./App.css";

export function App() {
  const [input, setInput] = useState<{ file: File; url: string } | undefined>();
  const [progress, setProgress] = useState<number | undefined | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [ffmpeg] = useState(() =>
    createFFmpeg({
      log: true,
      progress: ({ ratio }) => setProgress(ratio * 100),
    })
  );

  const [output, setOutput] = useState<
    { url: string; name: string } | undefined
  >();

  const compress = useCallback(async () => {
    logEvent(getAnalytics(firebaseApp), "compress");

    try {
      setProgress(undefined);
      setError(undefined);
      setOutput(undefined);

      if (!input) {
        return;
      }

      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }

      const { name } = input.file;
      ffmpeg.FS("writeFile", name, await fetchFile(input.file));
      const outputFilename = `${name}_compressed_${Date.now()}.ogg`;
      await ffmpeg.run(
        "-i",
        name,
        "-c:a",
        "libopus",
        "-b:a",
        "32k",
        "-vbr",
        "on",
        "-compression_level",
        "10",
        "-frame_duration",
        "60",
        "-application",
        "voip",
        outputFilename
      );
      const data = ffmpeg.FS("readFile", outputFilename);
      if (!data.length) {
        setError("An unknown error occurred, see developer console");
        return;
      }

      setOutput({
        url: URL.createObjectURL(
          new Blob([data.buffer], { type: "audio/ogg" })
        ),
        name: outputFilename,
      });
    } catch (error) {
      setProgress(null);
      setError(
        typeof error === "object" &&
          !!error &&
          "message" in error &&
          typeof error.message === "string"
          ? error.message
          : "An unknown error occurred, see developer console"
      );
    }
  }, [ffmpeg, input]);

  return (
    <div className="App">
      <header>
        <h1>Audio compressor</h1>
      </header>
      <section>
        <p>Compress your dialogue audio files locally on your browser</p>
        <input
          type="file"
          accept="audio/*"
          onChange={(event) => {
            setProgress(null);
            setError(undefined);
            setOutput(undefined);

            const file = event.target.files?.[0];
            setInput(
              file ? { file, url: URL.createObjectURL(file) } : undefined
            );
          }}
        />
        {!!input && (
          <>
            <div className="player-container">
              <audio controls src={input.url} />
            </div>
            <button onClick={compress}>Compress</button>
            {progress !== null && progress !== 100 && (
              <div>
                <progress max="100" value={progress}>{`${progress}%`}</progress>
              </div>
            )}
            {!!error && <p className="error">{error}</p>}
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
      </section>
      <div id="author">
        <p>
          by Louis Lagrange (
          <a href="https://twitter.com/Minishlink" target="_blank">
            @Minishlink
          </a>
          )
        </p>
      </div>
      <div id="source-code">
        <p>
          <a
            href="https://github.com/Minishlink/audio-compressor-webapp"
            target="_blank"
          >
            GitHub
          </a>
        </p>
      </div>
    </div>
  );
}

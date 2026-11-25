import { useEffect, useRef } from "react";
import type { Language, LogLine } from "../types";

type Props = {
  language: Language;
  logs: LogLine[];
  previewHtml: string;
  running: boolean;
};

export default function Output({ language, logs, previewHtml, running }: Props) {
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [logs]);

  if (language === "html") {
    return (
      <iframe
        className="preview"
        title="Preview"
        sandbox="allow-scripts"
        srcDoc={previewHtml}
      />
    );
  }

  return (
    <div className="terminal" role="log" aria-live="polite">
      {logs.length === 0 && !running && <div className="hint">Press Run to see output here.</div>}
      {logs.map((l, i) => (
        <pre key={i} className={`line ${l.stream}`}>
          {l.text}
        </pre>
      ))}
      {running && <div className="hint">Running...</div>}
      <div ref={end} />
    </div>
  );
}

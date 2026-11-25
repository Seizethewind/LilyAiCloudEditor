import { useCallback, useRef, useState } from "react";
import Editor, { type EditorHandle } from "./components/Editor";
import Output from "./components/Output";
import { runPython } from "./runners/python";
import { runJavaScript } from "./runners/javascript";
import { LANGUAGE_LABELS, SNIPPETS } from "./snippets";
import { useTheme } from "./theme";
import type { Language, LogLine } from "./types";

const LANGUAGES: Language[] = ["python", "javascript", "html"];
const SYMBOLS = ["Tab", "(", ")", "{", "}", "[", "]", '"', "'", ":", ";", "=", "#", "_"];

export default function App() {
  const { theme, toggle } = useTheme();
  const editor = useRef<EditorHandle>(null);

  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState<Record<Language, string>>({ ...SNIPPETS });
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [previewHtml, setPreviewHtml] = useState(SNIPPETS.html);
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState<"editor" | "output">("editor");

  const addLine = useCallback((line: LogLine) => setLogs((prev) => [...prev, line]), []);

  const run = useCallback(async () => {
    setTab("output");
    if (language === "html") {
      setPreviewHtml(code.html);
      return;
    }
    setLogs([]);
    setRunning(true);
    try {
      if (language === "python") await runPython(code.python, addLine);
      else await runJavaScript(code.javascript, addLine);
    } finally {
      setRunning(false);
    }
  }, [language, code, addLine]);

  return (
    <div className="app">
      <header className="topbar">
        <strong className="brand">Lily Editor</strong>
        <select
          aria-label="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {LANGUAGE_LABELS[l]}
            </option>
          ))}
        </select>
        <button className="run" onClick={run} disabled={running}>
          {running ? "Running..." : "Run"}
        </button>
        <button className="ghost" onClick={toggle} aria-label="Toggle dark and light mode">
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </header>

      <nav className="tabs" aria-label="Panels">
        <button className={tab === "editor" ? "active" : ""} onClick={() => setTab("editor")}>
          Editor
        </button>
        <button className={tab === "output" ? "active" : ""} onClick={() => setTab("output")}>
          Output
        </button>
      </nav>

      <main className="panes">
        <section className="pane" data-active={tab === "editor"}>
          <Editor
            ref={editor}
            value={code[language]}
            language={language}
            dark={theme === "dark"}
            onChange={(v) => setCode((prev) => ({ ...prev, [language]: v }))}
          />
          <div className="symbols">
            {SYMBOLS.map((s) => (
              <button
                key={s}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.current?.insert(s === "Tab" ? "    " : s)}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <section className="pane" data-active={tab === "output"}>
          <Output language={language} logs={logs} previewHtml={previewHtml} running={running} />
        </section>
      </main>
    </div>
  );
}

import type { OnLine } from "../types";

// Python in the browser via Pyodide, loaded from the jsDelivr CDN on first run.
const PYODIDE_VERSION = "0.26.4";
const BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Pyodide = any;

let pyodidePromise: Promise<Pyodide> | null = null;
let ready = false;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load Python runtime (check your connection)"));
    document.head.appendChild(s);
  });
}

function getPyodide(): Promise<Pyodide> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (!w.loadPyodide) await loadScript(BASE + "pyodide.js");
      const py = await w.loadPyodide({ indexURL: BASE });
      ready = true;
      return py;
    })();
    pyodidePromise.catch(() => {
      pyodidePromise = null;
    });
  }
  return pyodidePromise;
}

export async function runPython(code: string, onLine: OnLine): Promise<void> {
  if (!ready) onLine({ stream: "info", text: "Loading Python (first run only)..." });
  let py: Pyodide;
  try {
    py = await getPyodide();
  } catch (err) {
    onLine({ stream: "stderr", text: String((err as Error).message ?? err) });
    return;
  }

  py.setStdout({ batched: (s: string) => onLine({ stream: "stdout", text: s }) });
  py.setStderr({ batched: (s: string) => onLine({ stream: "stderr", text: s }) });
  // input() asks through a prompt dialog, which works on phones too.
  py.setStdin({ stdin: () => window.prompt("Input:") ?? "" });

  try {
    await py.runPythonAsync(code);
  } catch (err) {
    onLine({ stream: "stderr", text: String((err as Error).message ?? err) });
  }
}

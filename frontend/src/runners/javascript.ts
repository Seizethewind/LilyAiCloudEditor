import type { OnLine } from "../types";

// JavaScript runs in a Web Worker so an infinite loop can be terminated.
const WORKER_SOURCE = [
  'const send = (stream, text) => postMessage({ type: "log", stream, text });',
  "const fmt = (args) => args.map((x) => {",
  '  if (typeof x === "string") return x;',
  "  try { const s = JSON.stringify(x); return s === undefined ? String(x) : s; }",
  "  catch { return String(x); }",
  '}).join(" ");',
  'console.log = (...a) => send("stdout", fmt(a));',
  'console.info = (...a) => send("stdout", fmt(a));',
  'console.warn = (...a) => send("stderr", fmt(a));',
  'console.error = (...a) => send("stderr", fmt(a));',
  "onmessage = async (e) => {",
  "  try {",
  "    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;",
  "    await new AsyncFunction(e.data)();",
  "  } catch (err) {",
  '    send("stderr", String((err && err.stack) || err));',
  "  }",
  '  postMessage({ type: "done" });',
  "};",
].join("\n");

export function runJavaScript(code: string, onLine: OnLine, timeoutMs = 10000): Promise<void> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
    const worker = new Worker(url);

    const finish = () => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve();
    };

    const timer = setTimeout(() => {
      onLine({ stream: "stderr", text: `Stopped: ran longer than ${timeoutMs / 1000}s` });
      finish();
    }, timeoutMs);

    worker.onmessage = (e: MessageEvent) => {
      const d = e.data;
      if (d?.type === "log") onLine({ stream: d.stream, text: d.text });
      else if (d?.type === "done") finish();
    };
    worker.onerror = (e) => {
      onLine({ stream: "stderr", text: e.message });
      finish();
    };

    worker.postMessage(code);
  });
}

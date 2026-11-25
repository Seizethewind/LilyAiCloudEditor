export type Language = "python" | "javascript" | "html";

export type LogLine = {
  stream: "stdout" | "stderr" | "info";
  text: string;
};

export type OnLine = (line: LogLine) => void;

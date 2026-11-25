import type { Language } from "./types";

export const SNIPPETS: Record<Language, string> = {
  python: 'print("hello world")\n\nname = input("What is your name? ")\nprint(f"Nice to meet you, {name}!")\n',
  javascript: 'console.log("hello world");\n\nconst squares = [1, 2, 3, 4].map((n) => n * n);\nconsole.log(squares);\n',
  html: '<!doctype html>\n<html>\n  <body style="font-family: sans-serif; text-align: center">\n    <h1>hello world</h1>\n    <button onclick="this.textContent = \'clicked!\'">Click me</button>\n  </body>\n</html>\n',
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  python: "Python",
  javascript: "JavaScript",
  html: "HTML",
};

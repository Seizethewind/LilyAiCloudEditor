import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { oneDark } from "@codemirror/theme-one-dark";
import type { Language } from "../types";

export type EditorHandle = { insert: (text: string) => void };

type Props = {
  value: string;
  language: Language;
  dark: boolean;
  onChange: (value: string) => void;
};

function languageExtension(language: Language) {
  if (language === "python") return python();
  if (language === "javascript") return javascript();
  return html();
}

const Editor = forwardRef<EditorHandle, Props>(function Editor(
  { value, language, dark, onChange },
  ref
) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const latestValue = useRef(value);
  const latestOnChange = useRef(onChange);
  latestValue.current = value;
  latestOnChange.current = onChange;

  useImperativeHandle(ref, () => ({
    insert(text: string) {
      const v = view.current;
      if (!v) return;
      v.dispatch(v.state.replaceSelection(text));
      v.focus();
    },
  }));

  // Rebuild the editor when the language or theme changes; the text comes from the parent.
  useEffect(() => {
    if (!host.current) return;
    const state = EditorState.create({
      doc: latestValue.current,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        languageExtension(language),
        EditorView.lineWrapping,
        ...(dark ? [oneDark] : []),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) latestOnChange.current(u.state.doc.toString());
        }),
      ],
    });
    const v = new EditorView({ state, parent: host.current });
    view.current = v;
    return () => {
      v.destroy();
      view.current = null;
    };
  }, [language, dark]);

  return <div className="cm-host" ref={host} />;
});

export default Editor;

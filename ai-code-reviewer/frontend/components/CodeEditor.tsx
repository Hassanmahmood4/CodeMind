"use client";

import Editor from "@monaco-editor/react";

type Props = { value: string; onChange: (value: string) => void; language: string; readOnly?: boolean };

export default function CodeEditor({ value, onChange, language, readOnly = false }: Props) {
  return (
    <Editor
      height="100%"
      defaultLanguage="python"
      language={language}
      value={value}
      onChange={(v) => !readOnly && onChange(v ?? "")}
      theme="vs-dark"
      options={{ readOnly, minimap: { enabled: false }, fontSize: 14, padding: { top: 16 }, scrollBeyondLastLine: false }}
    />
  );
}

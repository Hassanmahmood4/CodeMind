import { useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { cn } from '../../lib/utils';

const MONACO_LANG_MAP = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  cpp: 'cpp',
  java: 'java',
};

export default function CodeEditor({ value, onChange, language, height = '100%', className }) {
  const monacoLang = MONACO_LANG_MAP[language] || 'plaintext';

  const handleEditorChange = useCallback(
    (val) => {
      onChange(val || '');
    },
    [onChange]
  );

  return (
    <div className={cn('overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950', className)}>
      <Editor
        height={height}
        language={monacoLang}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          fontSize: 13,
          fontFamily: 'ui-monospace, monospace',
          padding: { top: 16 },
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          wordWrap: 'off',
          automaticLayout: true,
        }}
        loading={
          <div className="flex h-full items-center justify-center bg-[#1e1e1e] text-zinc-500">
            Loading editor...
          </div>
        }
      />
    </div>
  );
}

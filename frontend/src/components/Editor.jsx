import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ file, content, onChange }) => {
    const handleEditorChange = (value) => {
        onChange(value);
    };

    if (!file) {
        return (
            <div className="flex items-center justify-center h-full text-gaze-muted">
                Select a file to edit
            </div>
        );
    }

    const language = file.name.endsWith('.gd') ? 'python' : // GDScript syntax is close to Python for basic highlighting
        file.name.endsWith('.json') ? 'json' :
            'plaintext';

    return (
        <div className="h-full w-full bg-gaze-darker">
            <Editor
                height="100%"
                defaultLanguage={language}
                language={language}
                value={content}
                theme="vs-dark"
                onChange={handleEditorChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
        </div>
    );
};

export default CodeEditor;

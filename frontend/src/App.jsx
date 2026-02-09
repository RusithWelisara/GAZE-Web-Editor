import React, { useState, useEffect, useCallback } from 'react';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/Editor';
import SceneTree from './components/SceneTree';
import { Play, Download, Save, Loader2 } from 'lucide-react';
import { cloneProject, listFiles, readFile, saveFile, parseScene, runProject } from './api';

function App() {
    const [projectId, setProjectId] = useState('demo-project'); // Default simple ID
    const [repoUrl, setRepoUrl] = useState('');
    const [files, setFiles] = useState([]);
    const [activeFile, setActiveFile] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [sceneData, setSceneData] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('Ready');

    // Load files on mount or project change
    const loadProjectFiles = useCallback(async () => {
        try {
            // Attempt to load files. If backend is empty/fresh, this might return empty or error.
            // For MVP, we'll try to list files. 
            const fileList = await listFiles(projectId);
            if (Array.isArray(fileList)) {
                setFiles(fileList);
            } else {
                setFiles([]); // Safety fallback
            }
        } catch (e) {
            console.error("Failed to load files", e);
            setFiles([]); // Clear files on error to prevent crash
            setStatus("Ready (No Project Loaded)"); // Less alarming message
        }
    }, [projectId]);

    useEffect(() => {
        loadProjectFiles();
    }, [loadProjectFiles]);

    const handleClone = async () => {
        if (!repoUrl) return;

        let newProjectId = projectId;
        try {
            // Extract project name from URL to use as ID
            // e.g., https://github.com/user/repo -> user-repo
            const urlParts = repoUrl.split('/');
            const repoName = urlParts.pop() || urlParts.pop(); // Handle trailing slash
            const user = urlParts.pop();

            if (repoName && user) {
                newProjectId = `${user}-${repoName}`;
                setProjectId(newProjectId);
            }
        } catch (e) {
            console.warn("Could not parse repo URL, using default ID");
        }

        setIsLoading(true);
        setStatus(`Cloning ${repoUrl}...`);
        try {
            await cloneProject(repoUrl, newProjectId);
            setStatus('Cloned successfully');
            // Refresh file list with new ID
            const fileList = await listFiles(newProjectId);
            if (Array.isArray(fileList)) {
                setFiles(fileList);
            } else {
                setFiles([]);
            }
        } catch (e) {
            if (e.message.includes('Project already exists')) {
                setStatus('Project already cloned. Loading...');
                try {
                    // Project exists, just load it
                    // We need to set projectId state to ensure subsequent reads work
                    setProjectId(newProjectId);
                    const fileList = await listFiles(newProjectId);
                    if (Array.isArray(fileList)) {
                        setFiles(fileList);
                        setStatus('Project Loaded');
                    }
                } catch (loadErr) {
                    setStatus(`Error loading existing project: ${loadErr.message}`);
                }
            } else {
                setStatus(`Error cloning: ${e.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = async (file) => {
        setActiveFile(file);
        setIsLoading(true);
        setStatus(`Loading ${file.name}...`);
        try {
            if (file.name.endsWith('.tscn')) {
                const data = await parseScene(projectId, file.path);
                setSceneData(data);
                setFileContent('');
            } else { // Text files (gd, etc)
                const { content } = await readFile(projectId, file.path);
                setFileContent(content);
                setSceneData(null);
            }
            setStatus('Ready');
        } catch (e) {
            setStatus(`Error reading file: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!activeFile) return;
        setStatus('Saving...');
        try {
            await saveFile(projectId, activeFile.path, fileContent);
            setStatus('Saved');
        } catch (e) {
            setStatus(`Error saving: ${e.message}`);
        }
    };

    const handleWebRun = async () => {
        if (!projectId) return;
        setIsLoading(true);
        setStatus("Building & Exporting Project...");
        try {
            const { url } = await runProject(projectId);
            setStatus("Running!");
            window.open(url, '_blank');
        } catch (e) {
            setStatus(`Run failed: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-screen flex-col bg-gaze-darker text-gaze-text font-sans">
            {/* Header */}
            <header className="h-14 border-b border-gaze-panel flex items-center px-4 justify-between bg-gaze-darker shrink-0">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gaze-accent rounded-sm"></div>
                        <span className="font-bold text-lg tracking-tight">GAZE</span>
                    </div>

                    <div className="flex items-center space-x-2 bg-gaze-panel px-2 py-1 rounded border border-gray-800">
                        <input
                            className="bg-transparent border-none outline-none text-xs w-64 text-gaze-muted focus:text-gaze-text"
                            placeholder="GitHub Repo URL (e.g. user/repo)"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                        />
                        <button onClick={handleClone} disabled={isLoading} className="text-gaze-accent hover:text-white">
                            <Download size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex justify-center text-xs text-gaze-muted">
                    {status}
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 text-gaze-muted hover:text-white px-3 py-1.5 rounded text-sm transition-colors"
                        title="Save (Ctrl+S)"
                    >
                        <Save size={16} />
                    </button>
                    <button
                        onClick={handleWebRun}
                        className="flex items-center space-x-2 bg-gaze-accent hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm transition-colors font-medium shadow-lg shadow-blue-900/20"
                    >
                        {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                        <span>Run Preview</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: File Explorer */}
                <div className="w-64 flex-shrink-0 flex flex-col">
                    <FileExplorer files={files} onFileSelect={handleFileSelect} />
                </div>

                {/* Center: Editor */}
                <div className="flex-1 relative border-r border-gaze-panel bg-gaze-darker flex flex-col">
                    {activeFile && activeFile.name.endsWith('.tscn') ? (
                        <div className="h-full flex flex-col items-center justify-center text-gaze-muted bg-gaze-darker/50">
                            <div className="mb-4 text-gaze-text font-medium">Scene Editor</div>
                            <div className="text-sm opacity-70">Visual editing disabled in text view. Use Scene Tree on right.</div>
                        </div>
                    ) : (
                        <CodeEditor
                            file={activeFile}
                            content={fileContent}
                            onChange={setFileContent}
                        />
                    )}
                </div>

                {/* Right: Scene Tree (Visible if scene is active) */}
                {sceneData && (
                    <div className="w-80 flex-shrink-0">
                        <SceneTree
                            rootNode={sceneData}
                            onNodeSelect={setSelectedNode}
                            selectedNode={selectedNode}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default App

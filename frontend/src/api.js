const API_URL = `http://${window.location.hostname}:3000`;

export const cloneProject = async (repoUrl, projectId) => {
    const res = await fetch(`${API_URL}/projects/clone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, projectId })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to clone project');
    }
    return res.json();
};

export const listFiles = async (projectId, path = '') => {
    const res = await fetch(`${API_URL}/projects/${projectId}/files?path=${encodeURIComponent(path)}`);
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to list files');
    }
    return res.json();
};

export const readFile = async (projectId, path) => {
    const res = await fetch(`${API_URL}/projects/${projectId}/file?path=${encodeURIComponent(path)}`);
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to read file');
    }
    return res.json();
};

export const saveFile = async (projectId, path, content) => {
    const res = await fetch(`${API_URL}/projects/${projectId}/file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, content })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save file');
    }
    return res.json();
};

export const parseScene = async (projectId, path) => {
    const res = await fetch(`${API_URL}/projects/${projectId}/scene?path=${encodeURIComponent(path)}`);
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to parse scene');
    }
    return res.json();
};

export const runProject = async (projectId) => {
    const res = await fetch(`${API_URL}/projects/${projectId}/run`);
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to run project');
    }
    return res.json();
};

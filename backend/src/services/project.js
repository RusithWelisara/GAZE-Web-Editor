const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = path.join(__dirname, '../../workspaces');

if (!fs.existsSync(WORKSPACE_DIR)) {
    fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
}

const cloneProject = async (repoUrl, projectId) => {
    const projectPath = path.join(WORKSPACE_DIR, projectId);
    if (fs.existsSync(projectPath)) {
        throw new Error('Project already exists');
    }
    await simpleGit().clone(repoUrl, projectPath);
    return projectPath;
};

const listFiles = (projectId, dirPath = '') => {
    const fullPath = path.join(WORKSPACE_DIR, projectId, dirPath);
    if (!fs.existsSync(fullPath)) {
        return []; // Return empty if path doesn't exist (e.g. empty project)
    }

    const entries = fs.readdirSync(fullPath, { withFileTypes: true });
    return entries.map(entry => {
        const relativePath = path.join(dirPath, entry.name).replace(/\\/g, '/');
        const item = {
            name: entry.name,
            type: entry.isDirectory() ? 'directory' : 'file',
            path: relativePath,
        };

        if (entry.isDirectory()) {
            // Recursive call for directories
            // Note: For very large repos this could be slow, but fine for MVP
            item.children = listFiles(projectId, relativePath);
        }

        return item;
    });
};

const readFile = (projectId, filePath) => {
    const fullPath = path.join(WORKSPACE_DIR, projectId, filePath);
    if (!fs.existsSync(fullPath)) {
        throw new Error('File not found');
    }
    return fs.readFileSync(fullPath, 'utf-8');
}

const saveFile = (projectId, filePath, content) => {
    const fullPath = path.join(WORKSPACE_DIR, projectId, filePath);
    fs.writeFileSync(fullPath, content);
}

module.exports = {
    cloneProject,
    listFiles,
    readFile,
    saveFile
};

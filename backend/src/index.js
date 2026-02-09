
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static previews
app.use('/previews', express.static(path.join(__dirname, '../public/previews')));

const projectService = require('./services/project');
const sceneParser = require('./services/sceneParser');
const runnerService = require('./services/runner');

// --- Project API ---

// 1. Clone Project
app.post('/projects/clone', async (req, res) => {
    const { repoUrl, projectId } = req.body;
    try {
        const projectPath = await projectService.cloneProject(repoUrl, projectId);
        res.json({ status: 'success', path: projectPath });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. List Files
app.get('/projects/:id/files', (req, res) => {
    const { id } = req.params;
    const { path: dirPath } = req.query;
    try {
        const files = projectService.listFiles(id, dirPath || '');
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Read File
app.get('/projects/:id/file', (req, res) => {
    const { id } = req.params;
    const { path: filePath } = req.query;
    try {
        const content = projectService.readFile(id, filePath);
        res.json({ content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Save File
app.post('/projects/:id/file', (req, res) => {
    const { id } = req.params;
    const { path: filePath, content } = req.body;
    try {
        projectService.saveFile(id, filePath, content);
        res.json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Parse Scene
app.get('/projects/:id/scene', (req, res) => {
    const { id } = req.params;
    const { path: filePath } = req.query;
    try {
        const content = projectService.readFile(id, filePath);
        const sceneTree = sceneParser.parseScene(content);
        res.json(sceneTree);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Run Project
app.get('/projects/:id/run', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await runnerService.runProject(id);
        res.json(result);
    } catch (error) {
        console.error("Run error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`GAZE Backend server running on port ${PORT}`);
});



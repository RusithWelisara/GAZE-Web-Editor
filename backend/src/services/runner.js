const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const GODOT_PATH = process.env.GODOT_PATH;
const PREVIEWS_DIR = path.join(__dirname, '../../public/previews');

// Ensure previews directory exists
if (!fs.existsSync(PREVIEWS_DIR)) {
    fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
}

const runProject = (projectId) => {
    return new Promise((resolve, reject) => {
        if (!GODOT_PATH) {
            return reject(new Error("GODOT_PATH not set in .env"));
        }

        const projectPath = path.join(__dirname, '../../workspaces', projectId);
        const projectFile = path.join(projectPath, 'project.godot');
        const outputDir = path.join(PREVIEWS_DIR, projectId);
        const outputFile = path.join(outputDir, 'index.html');

        if (!fs.existsSync(projectFile)) {
            return reject(new Error("Project file not found"));
        }

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // 1. Ensure export_presets.cfg exists for Web export
        const presetsPath = path.join(projectPath, 'export_presets.cfg');
        if (!fs.existsSync(presetsPath)) {
            console.log("Creating default export_presets.cfg...");
            const defaultPresets = `[preset.0]
name="Web"
platform="Web"
runnable=true
custom_features=""
export_filter="all_resources"
include_filter=""
exclude_filter=""
export_path=""
script_export_mode=1
script_encryption_key=""

[preset.0.options]
custom_template/debug=""
custom_template/release=""
variant/extensions_support=false
vram_texture_compression/for_desktop=true
vram_texture_compression/for_mobile=false
html/export_icon=true
html/custom_html_shell=""
html/head_include=""
html/canvas_resize_policy=2
html/focus_canvas_on_start=true
html/experimental_virtual_keyboard=false
`;
            fs.writeFileSync(presetsPath, defaultPresets);
        }

        console.log(`Exporting project ${projectId} to HTML5...`);
        // Command: godot --headless --path <project_path> --export-release "Web" <output_file>
        // Note: Using "Web" as the preset name matching the config above
        const cmd = `"${GODOT_PATH}" --headless --path "${projectPath}" --export-release "Web" "${outputFile}"`;

        console.log(`Running: ${cmd}`);

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`Exec error: ${error}`);
                console.error(`Stderr: ${stderr}`);
                // Godot might exit with non-zero even on success warnings, but usually regular errors.
                // For now reject.
                return reject(new Error(`Godot export failed: ${stderr || error.message}`));
            }

            console.log(`Export success: ${stdout}`);
            resolve({ url: `http://localhost:3000/previews/${projectId}/index.html` });
        });
    });
};

module.exports = {
    runProject
};

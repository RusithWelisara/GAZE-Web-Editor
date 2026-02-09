// Basic TSCN parser (simplified for MVP)
// Parses the text format of Godot scenes into a JSON tree structure

const parseScene = (tscnContent) => {
    const lines = tscnContent.split('\n');
    const nodes = [];
    let currentNode = null;

    lines.forEach(line => {
        line = line.trim();
        if (!line) return;

        if (line.startsWith('[node')) {
            // Parse node header
            const match = line.match(/name="([^"]+)"/);
            const typeMatch = line.match(/type="([^"]+)"/);
            const parentMatch = line.match(/parent="([^"]+)"/);

            currentNode = {
                name: match ? match[1] : 'Unknown',
                type: typeMatch ? typeMatch[1] : 'Node',
                parent: parentMatch ? parentMatch[1] : null,
                properties: {},
                children: []
            };
            nodes.push(currentNode);
        } else if (line.startsWith('[ext_resource')) {
            // Handle resources if needed
        } else if (currentNode && line.includes('=')) {
            // Simple property parsing
            const parts = line.split('=');
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim();
            currentNode.properties[key] = value;
        }
    });

    // Reconstruct tree
    const root = nodes.find(n => !n.parent);
    if (!root && nodes.length > 0) return nodes[0]; // Fallback

    const nodeMap = {};
    nodes.forEach(n => nodeMap[n.name] = n);

    nodes.forEach(n => {
        if (n.parent) {
            // Handle parent paths like "." or "Parent/Child"
            // Simplified: assume direct parent name for now or '.'
            const parentName = n.parent === '.' ? root.name : n.parent.split('/').pop();
            // This logic is very simplified. Godot paths can be complex.
            // For MVP, we'll try to find by name.
            const parent = nodes.find(p => p.name === parentName || (n.parent === '.' && p === root));
            if (parent) {
                parent.children.push(n);
            }
        }
    });

    return root;
};

// Serialize back to TSCN (placeholder/basic implementation)
const serializeScene = (rootNode) => {
    let output = `[gd_scene load_steps=1 format=3 uid="uid://placeholder"]\n\n`;

    // Flatten tree
    const flatNodes = [];
    const traverse = (node, parentPath) => {
        flatNodes.push({ ...node, parentPath });
        node.children.forEach(child => traverse(child, parentPath ? `${parentPath}/${node.name}` : '.'));
    };
    traverse(rootNode, null);

    flatNodes.forEach(node => {
        let line = `[node name="${node.name}" type="${node.type}"`;
        if (node.parentPath) {
            line += ` parent="${node.parentPath}"`;
        }
        line += `]\n`;

        for (const [key, value] of Object.entries(node.properties)) {
            line += `${key} = ${value}\n`;
        }
        output += line + '\n';
    });

    return output;
}

module.exports = {
    parseScene,
    serializeScene
};

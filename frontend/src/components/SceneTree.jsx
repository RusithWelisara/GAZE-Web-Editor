import React, { useState } from 'react';
import { Box, ChevronRight, ChevronDown } from 'lucide-react';

const SceneNode = ({ node, level, onSelect, selectedNode }) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleToggle = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleSelect = (e) => {
        e.stopPropagation();
        onSelect(node);
    }

    const isSelected = selectedNode && selectedNode.name === node.name; // Simple matching for now

    return (
        <div>
            <div
                className={`flex items-center py-1 px-2 hover:bg-gaze-panel cursor-pointer text-sm ${isSelected ? 'bg-gaze-panel text-white' : ''}`}
                onClick={handleSelect}
            >
                <span className="mr-1 text-gaze-muted" onClick={handleToggle}>
                    {node.children && node.children.length > 0 ? (
                        isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    ) : <span className="w-3.5 inline-block" />}
                </span>
                <Box size={14} className="mr-2 text-green-400" />
                <span className="text-gaze-text truncate">{node.name}</span>
                <span className="ml-auto text-xs text-gaze-muted">{node.type}</span>
            </div>
            {isOpen && node.children && (
                <div className="pl-4">
                    {node.children.map((child, index) => (
                        <SceneNode key={index} node={child} level={level + 1} onSelect={onSelect} selectedNode={selectedNode} />
                    ))}
                </div>
            )}
        </div>
    );
};

const SceneTree = ({ rootNode, onNodeSelect, selectedNode }) => {
    if (!rootNode) return <div className="p-4 text-gaze-muted text-sm text-center">No scene opened</div>;

    return (
        <div className="h-full bg-gaze-darker border-l border-gaze-panel flex flex-col">
            <div className="p-3 border-b border-gaze-panel uppercase text-xs font-bold text-gaze-muted tracking-wide">
                Scene
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                <SceneNode node={rootNode} level={0} onSelect={onNodeSelect} selectedNode={selectedNode} />
            </div>
            {selectedNode && (
                <div className="h-1/3 border-t border-gaze-panel p-3 overflow-y-auto">
                    <div className="uppercase text-xs font-bold text-gaze-muted tracking-wide mb-2">Inspector</div>
                    <div className="space-y-2">
                        {Object.entries(selectedNode.properties || {}).map(([key, value]) => (
                            <div key={key} className="flex flex-col">
                                <label className="text-xs text-gaze-muted">{key}</label>
                                <input
                                    type="text"
                                    value={value}
                                    readOnly // Read-only for MVP UI, implementing full edit is complex
                                    className="bg-gaze-panel text-gaze-text text-sm p-1 rounded border border-transparent focus:border-gaze-accent outline-none"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SceneTree;

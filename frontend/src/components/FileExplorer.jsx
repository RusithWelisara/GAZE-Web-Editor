import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

const FileItem = ({ item, level, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (e) => {
        e.stopPropagation();
        if (item.type === 'directory') {
            setIsOpen(!isOpen);
        } else {
            onSelect(item);
        }
    };

    return (
        <div>
            <div
                className={`flex items-center py-1 px-2 hover:bg-gaze-panel cursor-pointer text-sm ${level > 0 ? 'ml-4' : ''}`}
                onClick={handleToggle}
            >
                <span className="mr-1 text-gaze-muted">
                    {item.type === 'directory' ? (
                        isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    ) : <span className="w-3.5" />}
                </span>
                <span className="mr-2 text-gaze-accent">
                    {item.type === 'directory' ? <Folder size={16} /> : <File size={16} />}
                </span>
                <span className="text-gaze-text">{item.name}</span>
            </div>
            {isOpen && item.children && (
                <div className="border-l border-gaze-panel ml-2">
                    {item.children.map((child, index) => (
                        <FileItem key={index} item={child} level={level + 1} onSelect={onSelect} />
                    ))}
                </div>
            )}
        </div>
    );
};

const FileExplorer = ({ files, onFileSelect }) => {
    return (
        <div className="h-full bg-gaze-darker border-r border-gaze-panel flex flex-col">
            <div className="p-3 border-b border-gaze-panel uppercase text-xs font-bold text-gaze-muted tracking-wide">
                Project
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {files.map((file, index) => (
                    <FileItem key={index} item={file} level={0} onSelect={onFileSelect} />
                ))}
            </div>
        </div>
    );
};

export default FileExplorer;

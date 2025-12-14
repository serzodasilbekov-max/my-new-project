import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FileText, 
  Trash2, 
  Upload, 
  FilePlus, 
  ArrowLeft,
  HardDrive
} from 'lucide-react';

interface FileItem {
  name: string;
  is_dir: boolean;
  size?: number;
  path: string;
}

const FileSystem: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const loadFiles = async (path: string) => {
    setIsLoading(true);
    try {
      const items = await puter.fs.readdir(path);
      // Sort: Directories first, then files
      const sorted = items.sort((a: FileItem, b: FileItem) => {
        if (a.is_dir && !b.is_dir) return -1;
        if (!a.is_dir && b.is_dir) return 1;
        return a.name.localeCompare(b.name);
      });
      setFiles(sorted);
      setCurrentPath(path);
    } catch (error) {
      console.error('FS Error:', error);
      alert('Failed to load directory. Make sure you are signed in.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles(currentPath);
  }, []); // Initial load

  const handleNavigate = (path: string) => {
    loadFiles(path);
  };

  const handleUp = () => {
    if (currentPath === '/') return;
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
    loadFiles(parentPath);
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName) return;
    
    try {
      const fullPath = currentPath === '/' ? `/${newFileName}` : `${currentPath}/${newFileName}`;
      await puter.fs.write(fullPath, "New empty file created by Puter.js Explorer");
      setNewFileName('');
      setIsCreating(false);
      loadFiles(currentPath);
    } catch (error) {
      console.error('Create File Error:', error);
      alert('Failed to create file');
    }
  };

  const handleDelete = async (item: FileItem) => {
    if (!confirm(`Are you sure you want to delete ${item.name}?`)) return;
    
    try {
      await puter.fs.delete(item.path);
      loadFiles(currentPath);
    } catch (error) {
      console.error('Delete Error:', error);
      alert('Failed to delete item');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <HardDrive className="text-blue-500" />
          Cloud Storage
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            <FilePlus size={18} />
            New File
          </button>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateFile} className="mb-4 p-4 bg-white border border-blue-100 rounded-xl shadow-sm flex gap-2 animate-in fade-in slide-in-from-top-2">
          <input
            autoFocus
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="example.txt"
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            Create
          </button>
          <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-500 hover:text-slate-700 text-sm">
            Cancel
          </button>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumb / Nav Bar */}
        <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <button 
            onClick={handleUp} 
            disabled={currentPath === '/'}
            className="p-1.5 rounded-md hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="font-mono text-sm text-slate-600 px-2 py-1 bg-white border border-slate-200 rounded w-full">
            {currentPath}
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-40 text-slate-400">Loading...</div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-2">
              <Folder size={40} strokeWidth={1.5} />
              <span>Empty directory</span>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50">
              {files.map((file) => (
                <li key={file.path} className="group flex items-center justify-between p-3 hover:bg-blue-50/50 transition-colors cursor-pointer"
                    onClick={() => file.is_dir ? handleNavigate(file.path) : null}
                >
                  <div className="flex items-center gap-3">
                    {file.is_dir ? (
                      <Folder size={20} className="text-blue-400 fill-blue-50" />
                    ) : (
                      <FileText size={20} className="text-slate-400" />
                    )}
                    <span className="text-sm text-slate-700 font-medium">{file.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!file.is_dir && <span className="text-xs text-slate-400">{file.size} bytes</span>}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(file); }}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileSystem;
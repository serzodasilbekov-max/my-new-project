import React from 'react';
import { 
  MessageSquare, 
  HardDrive, 
  Database, 
  Layout,
  LogOut,
  Image as ImageIcon
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onSignOut: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, user, onSignOut }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layout },
    { id: 'ai', label: 'AI Chat', icon: MessageSquare },
    { id: 'media', label: 'Generative Media', icon: ImageIcon },
    { id: 'fs', label: 'Cloud Storage', icon: HardDrive },
    { id: 'kv', label: 'KV Database', icon: Database },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Puter.js
        </h1>
        <p className="text-xs text-slate-500 mt-1">Feature Explorer</p>
      </div>

      <div className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100">
        {user ? (
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-slate-900 truncate">{user.username}</span>
              <span className="text-xs text-slate-500 truncate">Puter User</span>
            </div>
            <button 
              onClick={onSignOut}
              className="text-slate-400 hover:text-red-500 transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="text-xs text-center text-slate-400">
            Not signed in
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
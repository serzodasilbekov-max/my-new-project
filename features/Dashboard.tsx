import React from 'react';
import { Sparkles, Cloud, Lock } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Welcome to Puter.js Explorer</h2>
      <p className="text-slate-600 mb-8 text-lg">
        This application demonstrates the capabilities of the Puter.js SDK. 
        Interact with AI models, manage cloud files, and store data in a key-value store, all running client-side with no backend.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
            <Sparkles size={24} />
          </div>
          <h3 className="font-semibold text-lg mb-2">Generative AI</h3>
          <p className="text-slate-500 text-sm">
            Access GPT-4, Claude, Gemini and more directly from the browser. Supports text generation and image analysis.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
            <Cloud size={24} />
          </div>
          <h3 className="font-semibold text-lg mb-2">Cloud Storage</h3>
          <p className="text-slate-500 text-sm">
            Full file system access in the cloud. Read, write, upload, and manage files programmatically.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 text-emerald-600">
            <Lock size={24} />
          </div>
          <h3 className="font-semibold text-lg mb-2">KV Database</h3>
          <p className="text-slate-500 text-sm">
            Fast, persistent key-value storage for your application data. Perfect for settings and simple data structures.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './features/Dashboard';
import AIChat from './features/AIChat';
import AIMedia from './features/AIMedia';
import FileSystem from './features/FileSystem';
import KVStore from './features/KVStore';
import SignIn from './features/Auth/SignIn';
import { Key, ExternalLink } from 'lucide-react';

interface ProtectedFeatureProps {
  user: any;
  onSignIn: () => void;
  children: React.ReactNode;
}

const ProtectedFeature: React.FC<ProtectedFeatureProps> = ({ user, onSignIn, children }) => {
  if (!user) return <SignIn onSignIn={onSignIn} />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // API Key State
  const [hasApiKey, setHasApiKey] = useState(false);
  const [checkingKey, setCheckingKey] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // 1. Check API Key validity if in AI Studio environment
    let keyStatus = false;
    try {
        if (window.aistudio) {
            keyStatus = await window.aistudio.hasSelectedApiKey();
        } else {
            // Fallback for standard environments without the extension/wrapper
            keyStatus = true; 
        }
    } catch (e) {
        console.error("API Key check failed", e);
        // Default to false if check fails in a studio environment, or true if it's just missing
        keyStatus = !window.aistudio;
    }
    setHasApiKey(keyStatus);
    setCheckingKey(false);

    // 2. Check Puter User Authentication
    try {
      if (puter.auth.isSignedIn()) {
        const userData = await puter.auth.getUser();
        setUser(userData);
      }
    } catch (err) {
      console.error("Auth check failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectKey = async () => {
      if (window.aistudio) {
          try {
              await window.aistudio.openSelectKey();
              // Assume success as per guidance to mitigate race conditions
              setHasApiKey(true);
          } catch (e: any) {
              console.error("Key selection error", e);
              // If the specific error occurs, reset state to prompt again
              if (e.message?.includes("Requested entity was not found")) {
                  setHasApiKey(false);
              }
          }
      }
  };

  const handleSignIn = async () => {
    try {
      await puter.auth.signIn();
      // Re-check user after sign in
      if (puter.auth.isSignedIn()) {
        const userData = await puter.auth.getUser();
        setUser(userData);
      }
    } catch (err) {
      console.error("Sign in failed", err);
    }
  };

  const handleSignOut = () => {
    puter.auth.signOut();
    setUser(null);
    setActiveTab('dashboard'); // Reset to dashboard on sign out
  };

  // Show global loader while checking key or user auth
  if (checkingKey || loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Mandatory API Key Selection Screen (Only if in AI Studio environment)
  if (!hasApiKey && window.aistudio) {
      return (
          <div className="h-screen w-screen flex items-center justify-center bg-gray-50 p-4">
              <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Key size={32} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">API Key Required</h2>
                <p className="text-slate-500 mb-6">
                  To access the full capabilities of this application, please select a Google Cloud API key with billing enabled.
                </p>
                
                <button
                  onClick={handleSelectKey}
                  className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-200 mb-6"
                >
                  Select API Key
                </button>

                <div className="text-xs text-slate-400 border-t border-slate-100 pt-4">
                    <p className="mb-1">Requires a paid GCP project.</p>
                    <a 
                        href="https://ai.google.dev/gemini-api/docs/billing" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center justify-center gap-1"
                    >
                        View Billing Documentation <ExternalLink size={10} />
                    </a>
                </div>
              </div>
          </div>
      );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'ai':
        return (
          <ProtectedFeature user={user} onSignIn={handleSignIn}>
            <AIChat />
          </ProtectedFeature>
        );
      case 'media':
        return (
          <ProtectedFeature user={user} onSignIn={handleSignIn}>
            <AIMedia />
          </ProtectedFeature>
        );
      case 'fs':
        return (
          <ProtectedFeature user={user} onSignIn={handleSignIn}>
            <FileSystem />
          </ProtectedFeature>
        );
      case 'kv':
        return (
          <ProtectedFeature user={user} onSignIn={handleSignIn}>
            <KVStore />
          </ProtectedFeature>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user}
        onSignOut={handleSignOut}
      />
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
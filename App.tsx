import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './features/Dashboard';
import AIChat from './features/AIChat';
import AIMedia from './features/AIMedia';
import FileSystem from './features/FileSystem';
import KVStore from './features/KVStore';
import SignIn from './features/Auth/SignIn';

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

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
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

  const handleSignIn = async () => {
    try {
      await puter.auth.signIn();
      await checkUser();
    } catch (err) {
      console.error("Sign in failed", err);
    }
  };

  const handleSignOut = () => {
    puter.auth.signOut();
    setUser(null);
    setActiveTab('dashboard'); // Reset to dashboard on sign out
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
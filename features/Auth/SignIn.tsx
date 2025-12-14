import React from 'react';
import { UserCircle } from 'lucide-react';

interface SignInProps {
  onSignIn: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserCircle size={32} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign in to Puter</h2>
        <p className="text-slate-500 mb-8">
          Access your cloud storage, AI models, and database by connecting your Puter account.
        </p>
        <button
          onClick={onSignIn}
          className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-200"
        >
          Connect Puter Account
        </button>
      </div>
    </div>
  );
};

export default SignIn;
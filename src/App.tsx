import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LoginForm } from './components/Auth/LoginForm';
import { SignupForm } from './components/Auth/SignupForm';
import { Dashboard } from './components/Dashboard/Dashboard';

const AppContent: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        {showLogin ? (
          <LoginForm onSwitchToSignup={() => setShowLogin(false)} />
        ) : (
          <SignupForm onSwitchToLogin={() => setShowLogin(true)} />
        )}
      </div>
    );
  }

  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;

import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import ProtectedPage from './pages/ProtectedPage';

type AuthenticationStatusResponse = {
  authenticated: boolean;
  username: string | null;
};

export default function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/auth-status', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('auth-status request failed');
        }

        const authStatus: AuthenticationStatusResponse = await response.json();
        if (!isMounted) {
          return;
        }

        setIsAuthenticated(authStatus.authenticated);
        setUsername(authStatus.username);
      } catch {
        if (isMounted) {
          setIsAuthenticated(false);
          setUsername(null);
        }
      } finally {
        if (isMounted) {
          setAuthChecked(true);
        }
      }
    };

    checkAuthStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
      window.location.href = '/api/logout';
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppLayout isAuthenticated={isAuthenticated}>
            <AboutPage />
          </AppLayout>
        }
      />
      <Route
        path="/about"
        element={
          <AppLayout isAuthenticated={isAuthenticated}>
            <AboutPage />
          </AppLayout>
        }
      />
      <Route
        path="/protected"
        element={
          <AppLayout isAuthenticated={isAuthenticated}>
            <ProtectedPage
              authChecked={authChecked}
              isAuthenticated={isAuthenticated}
              username={username}
            />
          </AppLayout>
        }
      />
      <Route path="*" element={<Navigate to="/about" replace />} />
    </Routes>
  );
}


import {useCallback, useEffect, useState} from 'react';
import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
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
  const location = useLocation()

  const updateAuthStatus = useCallback(async () => {

      const response = await fetch('/api/auth/auth-status', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('auth-status request failed');
        }

        const authStatus: AuthenticationStatusResponse = await response.json();
        setIsAuthenticated(authStatus.authenticated);
        setUsername(authStatus.username);
        setAuthChecked(true);
    }, []);

  useEffect(() => {
      void updateAuthStatus();
  }, [updateAuthStatus, location.pathname]);

  useEffect(() => {
      const onFocus = () => void updateAuthStatus();
      window.addEventListener('focus', onFocus);
  }, [updateAuthStatus]);

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


import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import ResourceRequestComponent from "../components/ResourceRequestComponent";

export default function ProtectedPage({
  authChecked,
  isAuthenticated,
  username,
}: {
  authChecked: boolean;
  isAuthenticated: boolean;
  username: string | null;
}) {
  const [resourceRequestState, setResourceRequestState] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [resourceResponse, setResourceResponse] = useState('');

  function getMessageA() : string {
    if (username == "userA") {
      return "Your user has the role read:a, so this request is expected succeed.";
    }
    return "";
  }

  function getMessageB() : string {
    if (username == "userB") {
      return "Your user does not have the role read:b, so this request is expected to fail.";
    }
    return "";
  }

  useEffect(() => {
    if (!authChecked || !isAuthenticated) {
      return;
    }

    const abortController = new AbortController();

    return () => {
      abortController.abort();
    };
  }, [authChecked, isAuthenticated]);

  if (!authChecked) {
    return (
      <main className="main-shell">
        <p className="subtitle">Checking authentication...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/about" replace />;
  }

  return (
    <main className="main-shell">
      <section className="main-card protected-card">
        <p className="protected-text">Resource Access</p>
        <p>
          This page requests protected resources through the API gateway. Request success depends on user authentication, authorization, and the gateway and resource server configurations.
        </p>
        <p>
          Traffic flows securely from the gateway through a Direct VPC egress to reach the private resource server without exposing tokens.
        </p>
        <ul>
          <li>
            The <strong>api/a</strong> request requires the user to have the role <strong>read:a</strong>
          </li>
          <li>
            The <strong>api/b</strong> request requires the user to have the role <strong>read:b</strong>
          </li>
          <li>
            Both requests require the client to have the <strong>resources:read</strong> scope.
          </li>
        </ul>
        <p>
          Signed in as {username ?? 'User'}
          <a className="authorize-button" href="/api/logout">
            Logout to try as another user
          </a>
        </p>
        <ResourceRequestComponent url={"/api/a/v1"} expectedStatus={200} resultMessage={getMessageA()} />
        <ResourceRequestComponent url={"/api/b/v1"} expectedStatus={403} resultMessage={getMessageB()}/>
      </section>
    </main>
  );
}

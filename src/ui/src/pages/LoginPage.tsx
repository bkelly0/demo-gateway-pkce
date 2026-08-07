import { Link, Navigate } from 'react-router-dom';

/**
 * This page is not used yet, but will be used to support SSO logins from other providers.
 * @param param0
 * @param param0.authChecked
 * @param param0.isAuthenticated
 * @constructor
 */

export default function LoginPage({
  authChecked,
  isAuthenticated,
}: {
  authChecked: boolean;
  isAuthenticated: boolean;
}) {
  if (!authChecked) {
    return (
      <main className="page-shell">
        <section className="login-card">
          <p className="subtitle">Checking authentication...</p>
        </section>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/protected" replace />;
  }

  return (
    <main className="page-shell">
      <section className="login-card">
        <div className="login-card__header">
          <p className="eyebrow">Demo Gateway Auth</p>
          <h1>Sign in</h1>
          <p className="subtitle">Use the OAuth sign-in button below to continue.</p>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <a className="authorize-button" href="/oauth2/authorization/demo">
          Sign in with Demo Auth Server
        </a>

        <Link className="protected-link" to="/protected">
          View Protected Content
        </Link>
      </section>
    </main>
  );
}

import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

export default function AppLayout({
  children,
  isAuthenticated,
}: {
  children: ReactNode;
  isAuthenticated: boolean;
}) {
  return (
    <div className="app-layout">
      <nav className="top-nav" aria-label="Primary">
        <Link className="top-nav__link" to="/about">
          About
        </Link>
        {!isAuthenticated ? (
          <a className="top-nav__link" href="/oauth2/authorization/demo">
            Sign In As Demo User
          </a>
        ) : null}
        {isAuthenticated ? (
          <><Link className="top-nav__link" to="/protected">
            Resource Access
          </Link>
          <a className="top-nav__link" href="/api/logout">
            Logout
          </a>
          </>
        ) : null}
      </nav>
      {children}
    </div>
  );
}

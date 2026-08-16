export default function AboutPage() {
  return (
    <main className="main-shell">
        <section className="main-card">
            <p className="eyebrow">About</p>
            <article>
                <header>
                    <h1>Cloud-Native BFF & OAuth 2.0 Reference Architecture Demo</h1>
                    <p>A full-stack, zero-trust microservice architecture securing SPA clients via Backend-for-Frontend (BFF) patterns on Google Cloud Platform.</p>
                    <p>Click the button below to sign in as a demo user and see it in action, or read more below.</p>
                    <a className="authorize-button" href="/oauth2/authorization/demo">
                        Sign in with Demo Auth Server
                    </a>
                </header>

                <section>
                    <h2>Tech Stack</h2>
                    <ul>
                        <li>
                            <strong>Backend & Security:</strong> Java, Spring Boot, Spring Cloud Gateway, Spring Security, OAuth 2.0 / PKCE
                        </li>
                        <li>
                            <strong>Frontend:</strong> React, TypeScript
                        </li>
                        <li>
                            <strong>Cloud & Infrastructure:</strong> GCP Cloud Run, Direct VPC Egress, Secret Manager, Cloud Build CI/CD, IAM
                        </li>
                        <li>
                            <strong>Data & APIs:</strong> Valkey, OpenAPI Generator, Spring Cloud Config, PostgreSQL
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>Microservices Architecture</h2>
                    <dl>
                        <dt>
                            <h3>1. Backend-for-Frontend (BFF) Gateway</h3>
                            <p><strong>Tech:</strong> Java, Spring Cloud Gateway, Valkey, GCP Secret Manager</p>
                        </dt>
                        <dd>
                            Acts as the secure host for the React/TypeScript SPA and executes the OAuth 2.0 PKCE flow on behalf of the client. By storing session state in Valkey, the gateway maintains stateless, scalable instances on Cloud Run without requiring sticky sessions or exposing tokens to the browser. Uses Direct VPC Egress for internal routing. Secrets mounted from GCP Secret Manager.
                        </dd>
                        <dd>
                            <a className="about-github-link" target="_blank" href="https://github.com/bkelly0/demo-gateway-pkce">Github</a>
                        </dd>
                        <dt>
                            <h3>2. Single Page Application (SPA)</h3>
                            <p><strong>Tech:</strong> React, TypeScript</p>
                        </dt>
                        <dd>
                            Serves as the user interface, completely decoupled from OAuth tokens or secrets. All API calls pass through the BFF Gateway via secure HTTP-only session cookies.
                        </dd>
                        <dd>
                            <a className="about-github-link" target="_blank" href="https://github.com/bkelly0/demo-gateway-pkce">Github</a>
                        </dd>
                        <dt>
                            <h3>3. Authorization Server</h3>
                            <p><strong>Tech:</strong> Java, Spring Authorization Server, GCP Secret Manager</p>
                        </dt>
                        <dd>
                            Custom OAuth 2.0 / OIDC provider configured with CORS restricted to the gateway domain. Bootstraps default clients and users on startup, embedding global client scopes and fine-grained user roles directly into JWT claims. Secrets mounted from GCP Secret Manager.
                        </dd>
                        <dd>
                            <a className="about-github-link" target="_blank" href="https://github.com/bkelly0/demo-authentication-server">Github</a>
                        </dd>
                        <dt>
                            <h3>4. Resource Services</h3>
                            <p><strong>Tech:</strong> Java, Spring Boot, OpenAPI Generator, GCP Secret Manager</p>
                        </dt>
                        <dd>
                            Backend microservices invoked by the gateway’s Service Account. Enforces two-tier authorization: verifying general client scopes alongside granular user roles (e.g., <code>read:api:a</code>, <code>read:api:b</code>) on OpenAPI-generated API endpoints. Secrets mounted from GCP Secret Manager.
                        </dd>
                        <dd>
                            <a className="about-github-link" target="_blank" href="https://github.com/bkelly0/demo-resource-api">Github</a>
                        </dd>

                        <dt>
                            <h3>5. Configuration Server</h3>
                            <p><strong>Tech:</strong> Java, Spring Cloud Config</p>
                        </dt>
                        <dd>
                            Centralized configuration provider pulling non-secret application properties from a private Github repository.
                        </dd>
                        <dd>
                            <a className="about-github-link" target="_blank" href="https://github.com/bkelly0/demo-config-server">Github</a>
                        </dd>
                    </dl>
                </section>

                <section>
                    <h2>Key Security &amp; Infrastructure Highlights</h2>
                    <ul>
                        <li>
                            <strong>Zero Token Exposure:</strong> Implements the BFF pattern so access and refresh tokens stay strictly on the backend, insulating client-side JavaScript from token theft vectors.
                        </li>
                        <li>
                            <strong>GCP Least-Privilege IAM:</strong> Every Cloud Run service runs under a dedicated Service Account with scoped permissions for secret retrieval and inter-service calls.
                        </li>
                        <li>
                            <strong>Automated Delivery:</strong> Fully automated CI/CD pipeline using Google Cloud Build for building, testing, and deploying all microservices seamlessly.
                        </li>
                    </ul>
                </section>
            </article>
        </section>
    </main>
  );
}

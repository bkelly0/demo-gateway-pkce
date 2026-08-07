# Spring Cloud OAuth2 Authorization & Gateway Server

A unified API Gateway, OAuth2 Identity/Authorization Server, and Single Page Application (SPA) host built on Spring Cloud and deployed to Google Cloud Run.

This service handles authentication, session persistence across stateless containers, secret hydration, and secure downstream routing via private Google Cloud VPC networks.

---

## Architecture & Features

* **Unified Gateway & Identity Provider:** Functions as both the OAuth2 Authorization Server and the reverse proxy/host for the Single Page Application UI.
* **Stateless Scaling & Session Persistence:** User sessions are offloaded to **Valkey** (Redis-compatible), eliminating the need for sticky sessions/session affinity and enabling seamless autoscaling or container restarts.
* **Centralized Configuration & Secret Management:**
    * Non-secret runtime properties are managed dynamically via **Spring Cloud Config Server**.
    * Sensitive credentials and keys are fetched from **GCP Secret Manager** and mounted into the application environment via Spring Cloud Config.
* **Private Network Egress:** Configured with **Direct VPC Egress** on Cloud Run, enabling low-latency, private IP communication with internal downstream microservices.
* **Least-Privilege Security:** Runs under a dedicated, service-specific GCP Service Account bounded strictly by IAM least-privilege roles.
* **Automated CI/CD:** Continuous Integration and Deployment are managed via **Google Cloud Build** pipelines.

---

## Technology Stack

* **Language/Framework:** Java, Spring Boot, Spring Cloud Gateway, Spring Security OAuth2
* **Session Store:** Valkey
* **Cloud Platform:** Google Cloud Run, GCP Secret Manager, GCP VPC
* **Configuration:** Spring Cloud Config Server
* **CI/CD:** Google Cloud Build

---

## Deployment & Infrastructure

### Cloud Run Configuration
The service is deployed as a stateless container on Cloud Run with the following platform configurations:

1. **VPC Access:** Direct VPC Egress enabled for internal microservice routing.
2. **Service Account:** Configured with a custom IAM role granting access *only* to required secret versions in Secret Manager and VPC connector execution.

### CI/CD Pipeline (`cloudbuild.yaml`)
Automated builds trigger on commit to main branches:

1. **Build & Test:** Compiles Java source and runs unit/integration tests.
2. **Containerize:** Builds container image and pushes to Google Artifact Registry.
3. **Deploy:** Executes `gcloud run deploy` with environment flags binding Secret Manager refs and Direct VPC network connectivity.

---

## Configuration Management

Configuration is decoupled from the build artifact:

* **App Properties:** Pulled at boot from the Spring Cloud Config Server endpoint (`SPRING_CLOUD_CONFIG_URI`).
* **Secrets Provisioning:** Spring Cloud Config handles integration with GCP Secret Manager, injecting secrets into the Spring environment without writing them to disk.

---

## Local Development

### Prerequisites
* Java 17+ (or project-targeted JDK)
* Docker and Docker Compose
* Access to GCP project (for Config Server / Secret Manager authentication via ADC)
* Authentication server running on port 8081

### Quickstart

1. **Start local services:**
   ```bash
   docker compose up -d
   ```

2. **Run with local Valkey sessions:**
   ```bash
   gradle bootRun --args="--spring.profiles.active=disable-google-auth,database"
   ```
   This uses the `database` profile so sessions are stored in the local Valkey container.

3. **Or run with in-memory sessions:**
   ```bash
   gradle bootRun --args="--spring.profiles.active=disable-google-auth"
   ```
   This skips Valkey and keeps session state in memory.
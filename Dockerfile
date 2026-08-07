# syntax=docker/dockerfile:1

FROM gradle:9.5.1-jdk17 AS builder

USER root
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
    && apt-get install -y --no-install-recommends nodejs npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

COPY settings.gradle build.gradle ./
COPY src ./src
COPY cloudbuild.yaml ./

RUN gradle bootJar --no-daemon

FROM eclipse-temurin:17-jre-jammy AS runtime

WORKDIR /app
COPY --from=builder /workspace/build/libs/*-SNAPSHOT.jar /app/app.jar

EXPOSE 8080
ENV SERVER_PORT=8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]

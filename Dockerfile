# Dockerfile for mfe-angular13 security analysis with Trivy and SonarQube

# Base stage
FROM node:20-slim AS base

WORKDIR /mfe-angular13

# Copy source code
COPY . .


# --- Trivy stage ---
FROM aquasec/trivy:0.69.3 AS trivy

# Copy source from previous stage
COPY --from=base /mfe-angular13 /mfe-angular13
WORKDIR /mfe-angular13

# Crear carpeta para reportes
RUN mkdir -p /mfe-angular13/trivy
RUN rm -f /mfe-angular13/trivy/*

# Escaneo de vulnerabilidades (incluye devDependencies) una sola vez en JSON
RUN trivy fs \
  --exit-code 0 \
  --scanners vuln \
  --severity LOW,MEDIUM,HIGH,CRITICAL \
  --include-dev-deps \
  --format json \
  --output /mfe-angular13/trivy/trivy-results.json \
  --skip-dirs /mfe-angular13/trivy \
  /mfe-angular13

# Convertir JSON a tabla para lectura humana (evita un segundo escaneo)
RUN trivy convert \
  --format table \
  --scanners vuln \
  --severity LOW,MEDIUM,HIGH,CRITICAL \
  --output /mfe-angular13/trivy/trivy-results.txt \
  /mfe-angular13/trivy/trivy-results.json

# Escaneo de secretos separado (sin node_modules ni artefactos de build/reportes)
RUN trivy fs \
  --exit-code 0 \
  --scanners secret \
  --format json \
  --output /mfe-angular13/trivy/trivy-secrets-results.json \
  --skip-dirs /mfe-angular13/node_modules \
  --skip-dirs /mfe-angular13/dist \
  --skip-dirs /mfe-angular13/trivy \
  /mfe-angular13

RUN trivy convert \
  --format table \
  --scanners secret \
  --output /mfe-angular13/trivy/trivy-secrets-results.txt \
  /mfe-angular13/trivy/trivy-secrets-results.json

# Compatibilidad con nombres legacy consumidos por pipelines existentes
RUN cp /mfe-angular13/trivy/trivy-results.json /mfe-angular13/trivy/trivy-dist-results.json
RUN cp /mfe-angular13/trivy/trivy-results.txt /mfe-angular13/trivy/trivy-dist-results.txt


# --- SonarQube stage (optional, requires sonar-scanner config) ---
# Uncomment below to enable SonarQube analysis
# FROM sonarsource/sonar-scanner-cli:latest AS sonarqube
# COPY --from=base /mfe-angular13 /mfe-angular13
# WORKDIR /mfe-angular13
# COPY sonar-project.properties ./
# RUN sonar-scanner

# Final stage: just for inspection
FROM node:20-slim
WORKDIR /mfe-angular13
COPY --from=base /mfe-angular13 /mfe-angular13
COPY --from=trivy /mfe-angular13/trivy /mfe-angular13/trivy
# COPY --from=sonarqube /mfe-angular13/.scannerwork /mfe-angular13/.scannerwork

CMD ["true"]

SHELL := /bin/sh

.PHONY: trivy trivy-nocache trivy-summary

trivy:
	docker compose run --rm --build trivy-scan

trivy-nocache:
	docker compose build --no-cache trivy-scan
	docker compose run --rm trivy-scan

trivy-summary:
	@if [ ! -f trivy/trivy-results.json ]; then \
		echo "No existe trivy/trivy-results.json. Ejecuta primero: make trivy"; \
		exit 1; \
	fi
	@jq -r '\
		def countsev($$s): ([.Results[]?.Vulnerabilities[]? | select(.Severity == $$s)] | length); \
		["LOW","MEDIUM","HIGH","CRITICAL"][] as $$s \
		| "\($$s): \(countsev($$s))" \
	' trivy/trivy-results.json

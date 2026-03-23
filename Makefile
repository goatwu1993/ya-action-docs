GIT = $(shell which git)
GIT_BRANCH = $(shell git rev-parse --abbrev-ref HEAD)
GIT_COMMIT = $(shell git rev-parse --short HEAD)
GIT_COMMIT_TIME = $(shell git log -n 1 --pretty=format:"%ad" --date=iso)
DATE = $(shell date +"%Y-%m-%d")
NPM=$(shell which npm)
NPM_CMD=$(shell which npm)
NPM_RUN_CMD=$(NPM_CMD) run
NEEDS_API_STUB=

.PHONY: help
help: ## Show help messages
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-40s\033[0m %s\n", $$1, $$2}'

.PHONY: dist/index.js
dist/index.js: build ## Build dist

.PHONY: ci
ci: node_modules/.make.timestamp.ci ## ci

node_modules/.make.timestamp.ci: package.json package-lock.json ## Timestamp for ci
	$(NPM_CMD) ci --ignore-scripts
	@touch $@

README.md: ci package.json action.yml ## README.md
	$(NPM_RUN_CMD) action-docs

.PHONY: all
all: ci ## All
	$(NPM_RUN_CMD) fix
	$(NPM_RUN_CMD) tsc
	$(NPM_RUN_CMD) test
	$(NPM_RUN_CMD) action-docs
	$(NPM_RUN_CMD) build

.PHONY: test
test: unittest tsc ## test

.PHONY: unittest
unittest: ci ## unittest
	$(NPM_RUN_CMD) test

.PHONY: coverage
coverage: unittest ## coverage

.PHONY: test-snapshot-update
test-snapshot-update: ci ## update test snapshots
	$(NPM_RUN_CMD) test:snapshot-update

.PHONY: build
build: ci ## build
	$(NPM_RUN_CMD) build

.PHONY: fix
fix: ## fix
	$(NPM_RUN_CMD) fix

.PHONY: fix-unsafe
fix-unsafe: ## fix-unsafe
	$(NPM_RUN_CMD) fix-unsafe

.PHONY: lint
lint: ## Lint
	$(NPM_RUN_CMD) lint

.PHONY: format
format: ## Format
	$(NPM_RUN_CMD) format

.PHONY: tsc
tsc: ## Typescript Compile test. Will not emit
	$(NPM_RUN_CMD) tsc

.DEFAULT_GOAL := all

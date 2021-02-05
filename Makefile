#!/bin/make

SHELL := /bin/bash
GITCLOUD_FRONTEND_PATH := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
GITCLOUD_FRONTEND_NAME ?= "GitCloud"
GITCLOUD_FRONTEND_VERSION ?= "v0.1.0"
GITCLOUD_FRONTEND_DESCRIPTION ?= "Manage all your Git repositories, organisations, providers from one place."

ENV ?= local
-include config/.env.${ENV}
export

.DEFAULT_GOAL := help-frontend
.PHONY: help-frontend #: List available command.
help: help-frontend # alias for quick access
help-frontend:
	@awk 'BEGIN {FS = " ?#?: "; print ""$(GITCLOUD_FRONTEND_NAME)" "$(GITCLOUD_FRONTEND_VERSION)"\n"$(GITCLOUD_FRONTEND_DESCRIPTION)"\n\nUsage: make \033[36m<command>\033[0m\n\nCommands:"} /^.PHONY: ?[a-zA-Z_-]/ { printf "  \033[36m%-10s\033[0m %s\n", $$2, $$3 }' $(MAKEFILE_LIST)

.PHONY: docs-frontend #: Run documentation using Storybook.
docs: docs-frontend # alias for quick access
docs-frontend:
	@cd ${GITCLOUD_FRONTEND_PATH} && \
	${YARN} docs

.PHONY: lint-frontend #: Run linting.
lint: lint-frontend # alias for quick access
lint-frontend:
	@cd ${GITCLOUD_FRONTEND_PATH} && \
	${YARN} lint

.PHONY: tests-frontend #: Run tests.
tests: tests-frontend # alias for quick access
tests-frontend:
	@cd ${GITCLOUD_FRONTEND_PATH} && \
	${YARN} test

.PHONY: run-frontend #: Run frontend app.
run: run-frontend # alias for quick access
run-frontend: 
	@cd ${GITCLOUD_FRONTEND_PATH} && \
	${YARN} start

.PHONY: build-frontend #: Build frontend app.
build: build-frontend # alias for quick access
build-frontend: 
	@cd ${GITCLOUD_FRONTEND_PATH} && \
	${YARN} build
	
# Run scripts using make
%:
	@cd ${GITCLOUD_FRONTEND_PATH} && \
	if [[ -f "scripts/${*}.sh" ]]; then \
	${BASH} "scripts/${*}.sh"; fi

.PHONY: init-frontend #: Download project dependencies.
init: init-frontend # alias for quick access
init-frontend:
	@cd ${GITCLOUD_FRONTEND_PATH} && \
	${YARN} install

.PHONY: release-frontend #: Create new project version release.
release: release-frontend # alias for quick access
release-frontend:
	@cd ${GITCLOUD_FRONTEND_PATH} && \
	${BASH} scripts/release-frontend.sh

.PHONY: publish-frontend #: Publish project to NPM registry.
publish: publish-frontend # alias for quick access
publish-frontend:
	@cd ${GITCLOUD_FRONTEND_PATH} && \
	${YARN} publish-all

.PHONY: clean-frontend #: Download project dependencies.
clean: clean-frontend # alias for quick access
clean-frontend:
	@cd ${GITCLOUD_FRONTEND_PATH} && \
	${BASH} scripts/clean-frontend.sh


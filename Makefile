#!/bin/make

SHELL := /bin/bash
GITCLOUD_FRONTEND_PATH := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
GITCLOUD_FRONTEND_NAME ?= "GitCloud"
GITCLOUD_FRONTEND_VERSION ?= "0.1.0"
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
	test -f "scripts/${*}.sh" && \
	${SHELL} "scripts/${*}.sh"
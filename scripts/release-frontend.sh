#!/bin/bash
# file: release-frontend.sh
# description: Create new project version release.

RELEASE_VERSION=${GITCLOUD_FRONTEND_VERSION//\"}-${GIT_COMMIT_SHORT_SHA//\"}

# If is a stable release
if [[ "\"main\"" == "${GIT_BRANCH}" ]]; then
	RELEASE_VERSION=${GITCLOUD_FRONTEND_VERSION//\"}
fi

${YARN} lerna version ${RELEASE_VERSION} --yes
#!/bin/bash
# file: gitlab-ci-workaround.sh
# description: Allow GitLab CI to push changes to the repo.

echo "GIT_REPOSITORY_URL is set to ${GIT_REPOSITORY_URL}"

git config --system --unset credential.helper
git config --global user.name "${GIT_USER_NAME}"
git config --global user.email "${GIT_USER_EMAIL}"

# Set origin url
git remote set-url origin "${GIT_REPOSITORY_URL}"

# Leave detached git HEAD
git checkout -B "${GIT_BRANCH}" "${GIT_COMMIT_SHA}"
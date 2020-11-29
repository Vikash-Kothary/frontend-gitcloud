#!/bin/bash
# file: init-frontend.sh

# Ensure it's in the correct directory
# Needed for multi module projects
pushd "${GITCLOUD_FRONTEND_PATH}" 

init_default() {
	echo "[Node]: $(node -v)"
	echo "[NPM] : $(npm -v)"
	echo "[Yarn]: $(yarn -v)"
	echo
	yarn install
}

case "${ENV}" in
	"local" ) init_default ;;
	* ) init_default ;;
esac 

popd
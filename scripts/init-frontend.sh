#!/bin/bash
# file: init-frontend.sh

# Ensure it's in the correct directory
# Needed for multi module projects
pushd "${GITCLOUD_FRONTEND_PATH}" 

init_default() {
	echo "[Node]: $(${NODE} -v)"
	echo "[NPM] : $(${NPM} -v)"
	echo "[Yarn]: $(${YARN} -v)"
	echo
	${YARN=yarn} install
}

case "${ENV}" in
	"local" ) init_default ;;
	* ) init_default ;;
esac 

popd
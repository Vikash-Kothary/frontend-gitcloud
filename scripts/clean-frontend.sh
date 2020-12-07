#!/bin/bash
# file: clean-frontend.sh

# Ensure it's in the correct directory
# Needed for multi module projects
pushd "${GITCLOUD_FRONTEND_PATH}" 

clean_default() {
	gulp clean
	rm -rv node_modules
	rm -rv packages/**/node_modules
}

case "${ENV}" in
	"local" ) clean_default ;;
	* ) clean_default ;;
esac 

popd
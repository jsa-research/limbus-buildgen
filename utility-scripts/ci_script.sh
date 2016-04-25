
# Create a simple CI server by running:
#
# npm install githubhook -g
# set CI_SCRIPT_WWW_PATH=...
# githubhook -port=40252 --secret=GITHUB_SECRET push:limbus-buildgen ./utility-scripts/ci_script.sh
#

mkdir -p $CI_SCRIPT_WWW_PATH
npm test > $CI_SCRIPT_WWW_PATH/ci-test.txt
if [ $? -eq 0 ]
then curl -sL http://img.shields.io/badge/build-passing-brightgreen.svg > $CI_SCRIPT_WWW_PATH/badge.svg
else curl -sL http://img.shields.io/badge/build-failing-red.svg > $CI_SCRIPT_WWW_PATH/badge.svg
fi

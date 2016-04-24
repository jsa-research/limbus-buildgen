
# Create a simple CI server by running:
#
# npm install githubhook -g
# githubhook -port=40252 --secret=GITHUB_SECRET push:node-github-hook ./utility-scripts/ci_script.sh HTTP_SERVED_DIRECTORY
#

mkdir -p $1
npm test > $1/ci-test.txt
if [ $? -eq 0 ]
then curl -sL http://img.shields.io/badge/build-passing-brightgreen.svg > $1/badge.svg
else curl -sL http://img.shields.io/badge/build-failing-red.svg > $1/badge.svg
fi

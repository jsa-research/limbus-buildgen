
# Create a simple CI server by running:
#
# npm install node-static githubhook
# static -p40251 ci_public &
# githubhook -port=40252 --secret=GITHUB_SECRET push:node-github-hook ./utility-scripts/ci_script.sh
#

mkdir -p ci_public
npm test > ci_public/ci-test.log
if [ $? -eq 0 ]
then curl -sL http://img.shields.io/badge/build-passing-brightgreen.svg > ci_public/badge.svg
else curl -sL http://img.shields.io/badge/build-failing-red.svg > ci_public/badge.svg
fi

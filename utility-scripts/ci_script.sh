
# Create a simple CI server by running:
#
# npm install githubhook -g
# CI_SCRIPT_WWW_PATH=...
# githubhook --secret=GITHUB_SECRET push:limbus-buildgen ./utility-scripts/ci_script.sh
#

$CI_LOG=$CI_SCRIPT_WWW_PATH/ci-log.txt
$CI_DATE=`date`
$CI_BADGE=$CI_SCRIPT_WWW_PATH/badge.svg
$CI_PASSING_BADGE=http://img.shields.io/badge/build-passing-brightgreen.svg
$CI_FAILING_BADGE=http://img.shields.io/badge/build-failing-red.svg

mkdir -p $CI_SCRIPT_WWW_PATH
echo Starting CI Build at $CI_DATE > $CI_LOG
echo Pulling new changes... >> $CI_LOG
git pull >> $CI_LOG
echo Running tests... >> $CI_LOG
npm test >> $CI_LOG
if [ $? -eq 0 ]
then curl -sL $CI_PASSING_BADGE > $CI_BADGE ; echo TESTS PASSING! >> $CI_LOG
else curl -sL $CI_FAILING_BADGE > $CI_BADGE ; echo TESTS FAILING! >> $CI_LOG
fi

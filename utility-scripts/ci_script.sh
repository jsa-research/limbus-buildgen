
# limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
# Written in 2016 by Jesper Oskarsson jesosk@gmail.com
#
# To the extent possible under law, the author(s) have dedicated all copyright
# and related and neighboring rights to this software to the public domain worldwide.
# This software is distributed without any warranty.
#
# You should have received a copy of the CC0 Public Domain Dedication along with this software.
# If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.


# Create a simple CI server by running:
#
# npm install githubhook -g
# CI_SCRIPT_WWW_PATH=...
# export CI_SCRIPT_WWW_PATH
# githubhook --secret=GITHUB_SECRET push:limbus-buildgen ./utility-scripts/ci_script.sh
#

CI_LOG=$CI_SCRIPT_WWW_PATH/ci-log.txt
CI_DATE=`date`
CI_BADGE=$CI_SCRIPT_WWW_PATH/badge.svg
CI_PASSING_BADGE=http://img.shields.io/badge/build-passing-brightgreen.svg
CI_FAILING_BADGE=http://img.shields.io/badge/build-failing-red.svg

mkdir -p $CI_SCRIPT_WWW_PATH
echo Starting CI Build at $CI_DATE > $CI_LOG
echo BUILDGEN_NODE_VERSION: >> $CI_LOG
echo $BUILDGEN_NODE_VERSION >> $CI_LOG
echo >> $CI_LOG
echo BUILDGEN_TARGET_COMPILER: >> $CI_LOG
echo $BUILDGEN_TARGET_COMPILER >> $CI_LOG
echo >> $CI_LOG
. utility-scripts/install_node.sh $BUILDGEN_NODE_VERSION >> $CI_LOG 2>&1
. utility-scripts/echo_versions.sh >> $CI_LOG 2>&1
echo Pulling new changes... >> $CI_LOG
git pull >> $CI_LOG 2>&1
echo Installing dependencies... >> $CI_LOG
npm install >> $CI_LOG 2>&1
dependencies/fetch_dependencies.sh >> $CI_LOG 2>&1
echo Running tests... >> $CI_LOG
npm run test -- -t 20000 >> $CI_LOG 2>&1
if [ $? -eq 0 ]
then curl -sL $CI_PASSING_BADGE > $CI_BADGE ; echo TESTS PASSING! >> $CI_LOG
else curl -sL $CI_FAILING_BADGE > $CI_BADGE ; echo TESTS FAILING! >> $CI_LOG
fi

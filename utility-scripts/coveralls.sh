
# limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
# Written in 2014 by Jesper Oskarsson jesosk@gmail.com
#
# To the extent possible under law, the author(s) have dedicated all copyright
# and related and neighboring rights to this software to the public domain worldwide.
# This software is distributed without any warranty.
#
# You should have received a copy of the CC0 Public Domain Dedication along with this software.
# If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

# Get the position in the job list
job_version=`echo $TRAVIS_JOB_NUMBER | egrep -o "\.[0-9]$" | egrep -o [0-9]`

# If we're the first job for this build, send coverage information.
# We need to test this as sending the coverage information multiple times
# produces an error in some cases.
if test -z "$job_version" -o "$job_version" = "1"
then
    # Install lcov
    sudo apt-get install lcov

    # Cover tests
    make -f Makefile.coverage
    mocha  -t 20000 --require blanket -R mocha-lcov-reporter "**/*.unit.js" "**/*.feature.js" > javascript-coverage.info

    # Merge coverage files
    lcov -b . -d . -c -o c-coverage.info
    lcov --extract c-coverage.info "`pwd -P`/source/*" -o c-coverage.info
    ./node_modules/lcov-result-merger/bin/lcov-result-merger.js '*-coverage.info' 'coverage.info'

    # Send to coveralls.io
    cat coverage.info | ./node_modules/coveralls/bin/coveralls.js
fi

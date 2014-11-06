
# sea-strap.js - A "build anywhere" C/C++ makefile/project generator.
# Written in 2014 by Jesper Oskarsson jesosk@gmail.com
#
# To the extent possible under law, the author(s) have dedicated all copyright
# and related and neighboring rights to this software to the public domain worldwide.
# This software is distributed without any warranty.
#
# You should have received a copy of the CC0 Public Domain Dedication along with this software.
# If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

sudo apt-get install lcov

# C coverage
make -f Makefile.coverage
./duk sea-strap.js linux
lcov -b . -d . -c -o c-coverage.info
lcov --extract c-coverage.info "`pwd -P`/source/*" -o c-coverage.info

# Javascript coverage
mocha --require blanket -R mocha-lcov-reporter \"**/*.unit.js\" \"**/*.feature.js\" > javascript-coverage.info

# Merge coverage files
./node_modules/lcov-result-merger/bin/lcov-result-merger.js *-coverage.info coverage.info
cat coverage.info | ./node_modules/coveralls/bin/coveralls.js

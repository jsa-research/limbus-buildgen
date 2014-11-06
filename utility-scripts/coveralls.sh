
# sea-strap.js - A "build anywhere" C/C++ makefile/project generator.
# Written in 2014 by Jesper Oskarsson jesosk@gmail.com
#
# To the extent possible under law, the author(s) have dedicated all copyright
# and related and neighboring rights to this software to the public domain worldwide.
# This software is distributed without any warranty.
#
# You should have received a copy of the CC0 Public Domain Dedication along with this software.
# If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

# Install dependencies
sudo apt-get update
sudo apt-get install lcov ruby2.0
sudo gem install coveralls-lcov

# C coverage
make -f Makefile.coverage
./duk sea-strap.js linux
lcov -b . -d . -c -o duk.info
lcov --extract duk.info "`pwd -P`/source/*" -o duk.info
coveralls-lcov -n -v duk.info > duk.json

# Javascript coverage
mocha --require blanket -R mocha-lcov-reporter \"**/*.unit.js\" \"**/*.feature.js\" > c-coverage.json

# Merge coverage files
node ./utility-scripts/merge-coverage.js javascript-coverage.json duk.json > coverage.json
cat coverage.json | ./node_modules/coveralls/bin/coveralls.js

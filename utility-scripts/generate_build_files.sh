
# sea-strap.js - A "build anywhere" C/C++ makefile/project generator.
# Written in 2014 by Jesper Oskarsson jesosk@gmail.com
#
# To the extent possible under law, the author(s) have dedicated all copyright
# and related and neighboring rights to this software to the public domain worldwide.
# This software is distributed without any warranty.
#
# You should have received a copy of the CC0 Public Domain Dedication along with this software.
# If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

./duk sea-strap.js build_configs/freebsd.json > Makefile.freebsd
./duk sea-strap.js build_configs/linux.json > Makefile.linux
./duk sea-strap.js build_configs/darwin.json > Makefile.darwin
./duk sea-strap.js build_configs/win32.json > Makefile.mak

# This is used for sending coverage information from the C sources to coveralls.io
./duk sea-strap.js build_configs/coverage.json > Makefile.coverage

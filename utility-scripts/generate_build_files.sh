
# limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
# Written in 2014 by Jesper Oskarsson jesosk@gmail.com
#
# To the extent possible under law, the author(s) have dedicated all copyright
# and related and neighboring rights to this software to the public domain worldwide.
# This software is distributed without any warranty.
#
# You should have received a copy of the CC0 Public Domain Dedication along with this software.
# If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

generate_for_platform() {
    ./generated/limbus-buildgen --outputPath generated/$1 --host $1 build_configs/build.json
}

generate_for_platform linux
generate_for_platform darwin
generate_for_platform win32
generate_for_platform freebsd

# This is used for sending coverage information from the C sources to coveralls.io
./generated/limbus-buildgen --outputPath generated/coverage build_configs/coverage.json

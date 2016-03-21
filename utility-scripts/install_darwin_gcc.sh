
# limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
# Written in 2016 by Jesper Oskarsson jesosk@gmail.com
#
# To the extent possible under law, the author(s) have dedicated all copyright
# and related and neighboring rights to this software to the public domain worldwide.
# This software is distributed without any warranty.
#
# You should have received a copy of the CC0 Public Domain Dedication along with this software.
# If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

# As compiling GCC takes a long time, this script installs GNU GCC 6 only if
# the OS is OS X and BUILDGEN_TARGET_COMPILER is set to "gcc".

if test "$BUILDGEN_TARGET_COMPILER" = "gcc" -a `uname` = "Darwin"
then
    PRE_BUILD_DIR=`pwd`
    brew tap homebrew/versions
    brew update > /dev/null
    brew install homebrew/versions/gcc6
    cd $PRE_BUILD_DIR
fi

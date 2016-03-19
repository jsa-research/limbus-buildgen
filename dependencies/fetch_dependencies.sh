
# limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
# Written in 2014 by Jesper Oskarsson jesosk@gmail.com
#
# To the extent possible under law, the author(s) have dedicated all copyright
# and related and neighboring rights to this software to the public domain worldwide.
# This software is distributed without any warranty.
#
# You should have received a copy of the CC0 Public Domain Dedication along with this software.
# If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

duktape_version="1.4.0"


unamestr=`uname`
if test "$unamestr" = 'Darwin' -o "$unamestr" = 'FreeBSD'
then
    WGET="curl -s "
    WGET_OUT="-o"
else
    WGET="wget -q "
    WGET_OUT="-O"
fi

extract_tar_xz() {
    tar -xJf "$1.tar.xz"
    rm "$1.tar.xz"
}

# Make sure we don't install this in the root directory by mistake
cd dependencies 2> /dev/null

if test ! -d "duktape-$duktape_version"
then
    echo Fetching Duktape $duktape_version...
    $WGET "http://duktape.org/duktape-$duktape_version.tar.xz" $WGET_OUT "duktape-$duktape_version.tar.xz"

    echo Extracting Duktape $duktape_version...
    extract_tar_xz "duktape-$duktape_version"
fi

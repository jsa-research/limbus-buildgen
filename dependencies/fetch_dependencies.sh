
# limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
# Written in 2014 by Jesper Oskarsson jesosk@gmail.com
#
# To the extent possible under law, the author(s) have dedicated all copyright
# and related and neighboring rights to this software to the public domain worldwide.
# This software is distributed without any warranty.
#
# You should have received a copy of the CC0 Public Domain Dedication along with this software.
# If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

duktape_version="1.5.1"


unamestr=`uname`
if test "$unamestr" = 'Darwin' -o "$unamestr" = 'FreeBSD'
then
    WGET="curl -sL "
    WGET_OUT="-o"
else
    WGET="wget -q "
    WGET_OUT="-O"
fi

extract_tar_xz() {
    tar -xJf "$1.tar.xz" && rm "$1.tar.xz"
}

if type md5sum >/dev/null 2>&1
then
    VERIFY_MD5() {
        echo "$1  duktape-$duktape_version.tar.xz" | md5sum -c -
        return $?
    }
else
    VERIFY_MD5() {
        test "$(md5 duktape-$duktape_version.tar.xz)" = "MD5 (duktape-$duktape_version.tar.xz) = $1"
        return $?
    }
fi

if type sha512sum >/dev/null 2>&1
then
    VERIFY_SHA512() {
        echo "$1  duktape-$duktape_version.tar.xz" | sha512sum -c -
        return $?
    }
elif type shasum >/dev/null 2>&1
then
    VERIFY_SHA512() {
        echo "$1  duktape-$duktape_version.tar.xz" | shasum -a 512 -c -
        return $?
    }
else
    VERIFY_SHA512() {
        echo WARNING: No SHA512 utility, skipping verification!
    }
fi

verify_checksums() {
    if VERIFY_MD5 c3c3b19291b0da5cb45f99d79c7c148c
    then
        echo "MD5 checksum verified."
    else
        echo "ERROR: MD5 checksum did not match!"
        exit 2
    fi

    if VERIFY_SHA512 67f571400ddc305029d039a67e0676d653a174fc46f76e543de2ec462492b80768efe29d6c5253c9cdbf008f0cb596d517415da488ed921b9eb303df82b9020d
    then
        echo "SHA512 checksum verified."
    else
        echo "ERROR: SHA512 checksum did not match!"
        exit 2
    fi
}

# Make sure we don't install this in the root directory by mistake
cd dependencies 2> /dev/null

if test ! -d "duktape-$duktape_version"
then
    echo Fetching Duktape $duktape_version...
    $WGET "https://github.com/svaarala/duktape/releases/download/v$duktape_version/duktape-$duktape_version.tar.xz" $WGET_OUT "duktape-$duktape_version.tar.xz"

    echo Verifying checksums...
    verify_checksums

    echo Extracting Duktape $duktape_version...
    extract_tar_xz "duktape-$duktape_version"
fi

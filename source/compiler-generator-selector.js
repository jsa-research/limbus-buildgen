
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

module.exports.select = function (host, compilerDictionary) {
    if (host === 'win32' ||
        host === 'win32-make-cl-win32-x86' ||
        host === 'win32-make-cl-win32-x64') {
        return compilerDictionary.cl;
    }

    if (host === 'freebsd' ||
        host === 'darwin' ||
        host === 'linux-make-clang-linux-x86' ||
        host === 'linux-make-clang-linux-x64' ||
        host === 'freebsd-make-clang-freebsd-x86' ||
        host === 'freebsd-make-clang-freebsd-x64' ||
        host === 'darwin-make-clang-darwin-x86' ||
        host === 'darwin-make-clang-darwin-x64') {
        return compilerDictionary.clang;
    }

    if (host === 'linux' ||
        host === 'linux-make-gcc-linux-x86' ||
        host === 'linux-make-gcc-linux-x64' ||
        host === 'freebsd-make-gcc-freebsd-x64' ||
        host === 'darwin-make-gcc-darwin-x86' ||
        host === 'darwin-make-gcc-darwin-x64') {
        return compilerDictionary.gcc;
    }
};

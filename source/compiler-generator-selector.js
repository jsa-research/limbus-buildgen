
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var isClToolchain = function (toolchain) {
    return toolchain === 'win32' ||
           toolchain === 'win32-make-cl-win32-x86' ||
           toolchain === 'win32-make-cl-win32-x64';
};

var isClangToolchain = function (toolchain) {
    return toolchain === 'freebsd' ||
           toolchain === 'darwin' ||
           toolchain === 'linux-make-clang-linux-x86' ||
           toolchain === 'linux-make-clang-linux-x64' ||
           toolchain === 'freebsd-make-clang-freebsd-x86' ||
           toolchain === 'freebsd-make-clang-freebsd-x64' ||
           toolchain === 'darwin-make-clang-darwin-x86' ||
           toolchain === 'darwin-make-clang-darwin-x64';
};

var isGccToolchain = function (toolchain) {
    return toolchain === 'linux' ||
           toolchain === 'linux-make-gcc-linux-x86' ||
           toolchain === 'linux-make-gcc-linux-x64' ||
           toolchain === 'freebsd-make-gcc-freebsd-x64' ||
           toolchain === 'darwin-make-gcc-darwin-x86' ||
           toolchain === 'darwin-make-gcc-darwin-x64';
}

module.exports.select = function (toolchain, compilerDictionary) {
    if (isClToolchain(toolchain)) {
        return compilerDictionary.cl;
    }

    if (isClangToolchain(toolchain)) {
        return compilerDictionary.clang;
    }

    if (isGccToolchain(toolchain)) {
        return compilerDictionary.gcc;
    }

    return undefined;
};


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

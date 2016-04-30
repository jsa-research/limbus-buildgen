
module.exports.select = function (host, compilerDictionary) {
    if (host === 'win32' ||
        host === 'win32-cl') {
        return compilerDictionary.cl;
    }

    if (host === 'freebsd' ||
        host === 'darwin' ||
        host === 'linux-clang' ||
        host === 'freebsd-clang' ||
        host === 'darwin-clang') {
        return compilerDictionary.clang;
    }

    if (host === 'linux' ||
        host === 'linux-gcc' ||
        host === 'freebsd-gcc' ||
        host === 'darwin-gcc') {
        return compilerDictionary.gcc;
    }
};

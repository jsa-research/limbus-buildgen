
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

exports.path = function (path) {
    return path ? path.replace(/\//g, require('path').sep) : path;
};

exports.exec = function (command, options) {
    return new Promise(function(resolve, reject) {
        require('child_process').exec(
            command,
            {
                cwd: (options && options.cwd) ? exports.path(options.cwd) : undefined
            },
            function (error, stdout, stderr) {
                if (error) {
                    error.message += stdout + stderr;
                    error.stdout = stdout;
                    error.stderr = stderr;
                    reject(error);
                } else {
                    resolve({stdout: stdout, stderr: stderr});
                }
            });
    });
};

exports.rm = function (path, workingDirectory) {
    var rm = 'rm -Rf ';
    if (process.platform === 'win32') {
        rm = 'rmdir /S /Q ';
    }

    return exports.exec(rm + exports.path(path), {cwd: workingDirectory});
};

exports.cp = function (source, destination, workingDirectory) {
    var cp = 'cp ';
    if (process.platform === 'win32') {
        cp = 'copy /Y ';
    }

    return exports.exec(cp + exports.path(source) + ' ' + exports.path(destination), {cwd: workingDirectory});
};

exports.mkdir = function (path, workingDirectory) {
    return exports.exec('mkdir ' + exports.path(path), {cwd: workingDirectory});
};

exports.copyFiles = function (files, inputDirectory, outputDirectory, workingDirectory) {
    var copyFilePromise = function (file) {
        return exports.cp(inputDirectory + file, outputDirectory + file, workingDirectory);
    };

    var filePromise = Promise.resolve();

    files.forEach(function (file) {
        filePromise = filePromise.then(function () {
            return copyFilePromise(file);
        });
    });

    return filePromise;
};

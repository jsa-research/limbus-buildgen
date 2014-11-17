
exports.path = function (path) {
    return path ? path.replace(/\//g, require('path').sep) : path;
};

exports.exec = function (command, options, callback) {
    require('child_process').exec(
        command,
        options ? {cwd: exports.path(options.cwd)} : null,
        function (error, stdout, stderr) {
            if (error) {
                error.message += stdout + stderr;
            }
            return callback(error, stdout, stderr);
        });
};

exports.rm = function (path, workingDirectory, callback) {
    var rm = 'rm -Rf ';
    if (process.platform === 'win32') {
        rm = 'rmdir /S /Q ';
    }

    exports.exec(rm + exports.path(path), {cwd: workingDirectory}, function (error, stdout, stderr) {
        return callback(error);
    });
};

exports.cp = function (source, destination, workingDirectory, callback) {
    var cp = 'cp ';
    if (process.platform === 'win32') {
        cp = 'copy /Y ';
    }

    return exports.exec(cp + exports.path(source) + ' ' + exports.path(destination), null, function (error, stdout, stderr) {
        return callback(error);
    });
};

exports.mkdir = function (path, workingDirectory, callback) {
    exports.exec('mkdir ' + exports.path(path), {cwd: workingDirectory}, function (error, stdout, stderr) {
        return callback(error);
    });
};

exports.mkdirClean = function (path, workingDirectory, performAction, callback) {
    exports.mkdir(path, workingDirectory, function (error) {
        if (error === null) {
            return performAction(function (result) {
                exports.rm(path, workingDirectory, function (error) {
                    if (error === null) {
                        return callback(result);
                    } else {
                        return callback(error);
                    }
                });
            });
        } else {
            return callback(error);
        }
    });
};

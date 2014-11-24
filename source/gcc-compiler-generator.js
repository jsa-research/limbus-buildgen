
var typeCheck = require('./type-check');

exports.compilerCommand = function (options) {
    typeCheck.string(options, 'file', 'required');
    typeCheck.string(options, 'flags');
    typeCheck.stringArray(options, 'includePaths');
    
    var extraFlags = '';
    if (options.includePaths !== undefined) {
        var separator = ' -I';
        extraFlags += separator + options.includePaths.join(separator);
    }
    if (options.flags !== undefined) {
        extraFlags += ' ' + options.flags;
    }
    return 'gcc -c ' + options.file + ' -o ' + options.file + '.o' + extraFlags;
};

exports.linkerCommand = function (options) {
    if (options.type !== 'static-library' && options.type !== 'application') {
        throw new Error('invalid_type');
    }
    typeCheck.string(options, 'outputName', 'required');
    typeCheck.string(options, 'flags');
    typeCheck.stringArray(options, 'objectFiles', 'required');
    typeCheck.stringArray(options, 'libraries');
    
    var extraFlags = '';
    if (options.libraries !== undefined) {
        var separator = ' -L./ -l';
        extraFlags += separator + options.libraries.join(separator);
    }
    if (options.flags !== undefined) {
        extraFlags += ' ' + options.flags;
    }
    var command;
    var outputName;
    if (options.type === 'application') {
        command = 'gcc -o ';
        outputName = options.outputName;
    } else {
        command = 'ar rcs ';
        outputName = 'lib' + options.outputName + '.a';
    }
    return command + outputName + ' ' + options.objectFiles.join(' ') + extraFlags;
};


module.exports.normalize = function (config) {
    if (config.outputPath !== undefined && config.outputPath !== '' && config.outputPath.substr(-1) !== '/') {
        config.outputPath += '/';
    }
};


module.exports.project = function () {
    return {
        title: 'project',
        artifacts: [{
            title: 'app',
            type: 'application',
            host: process.platform,
            outputName: 'app',
            files: ['main.c']
        }]
    };
};

module.exports.projectWith = function (properties) {
    var project = module.exports.project();
    Object.assign(project, properties);
    return project;
}

module.exports.projectWithArtifactWith = function (properties) {
    var project = module.exports.project();
    Object.assign(project.artifacts[0], properties);
    return project;
}

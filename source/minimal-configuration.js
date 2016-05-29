
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var minimalArtifact = function () {
    return {
        title: 'app',
        type: 'application',
        host: process.platform,
        outputName: 'app',
        files: ['main.c']
    };
};

module.exports.project = function () {
    return {
        title: 'project',
        artifacts: [minimalArtifact()]
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

module.exports.artifactWith = function (properties) {
    var artifact = minimalArtifact();
    Object.assign(artifact, properties);
    return artifact;
}

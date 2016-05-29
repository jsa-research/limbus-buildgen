
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

require('should');
var minimalConfiguration = require('../source/minimal-configuration');

describe('minimal-configuration', function () {
    describe('project', function () {
        it('should return a new minimal project configuration object', function () {
            var configuration = minimalConfiguration.project();

            configuration.should.deepEqual({
                title: 'project',
                artifacts: [{
                    title: 'app',
                    type: 'application',
                    host: process.platform,
                    files: ['main.c'],
                    outputName: 'app'
                }]
            });
        });
    });

    describe('projectWith', function () {
        it('should return a new minimal project configuration object with the project properties overriden by the passed in object', function () {
            var configuration = minimalConfiguration.projectWith({
                title: 'other title'
            });

            configuration.should.deepEqual({
                title: 'other title',
                artifacts: [{
                    title: 'app',
                    type: 'application',
                    host: process.platform,
                    files: ['main.c'],
                    outputName: 'app'
                }]
            });
        });
    });

    describe('projectWithArtifactWith', function () {
        it('should return a new minimal project configuration object with the artifact properties overriden by the passed in object', function () {
            var configuration = minimalConfiguration.projectWithArtifactWith({
                title: 'other title'
            });

            configuration.should.deepEqual({
                title: 'project',
                artifacts: [{
                    title: 'other title',
                    type: 'application',
                    host: process.platform,
                    files: ['main.c'],
                    outputName: 'app'
                }]
            });
        });
    });

    describe('artifactWith', function () {
        it('should return a new minimal artifact configuration object with properties overriden by the passed in object', function () {
            var configuration = minimalConfiguration.artifactWith({
                title: 'other title'
            });

            configuration.should.deepEqual({
                title: 'other title',
                type: 'application',
                host: process.platform,
                files: ['main.c'],
                outputName: 'app'
            });
        });
    });
});

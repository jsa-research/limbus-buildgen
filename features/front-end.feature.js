
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
var Promise = require('promise');
var util = require('./util.js');
var shell = require('./shell.js');
var minimal = require('../source/minimal-configuration');

describe('Front-end', function () {
    beforeEach(function () {
        return util.beforeEach().then(function () {
            return shell.mkdir('platform', 'temp');
        });
    });

    afterEach(function () {
        return util.afterEach();
    });

    it('should take a flag to specify the target host', function () {
        return util.writeConfiguration(minimal.projectWithArtifactWith({
            host: undefined
        }))
        .then(util.generateWithParameters('--host ' + util.host))
        .then(util.build())
        .then(util.runBuiltExecutable())
        .then(util.matchOutput());
    });

    it('should take a flag to specify the output build path', function () {
        return util.writeConfiguration(minimal.projectWithArtifactWith({
            host: util.host
        }))
        .then(util.generateWithParameters('--outputPath platform'))
        .then(util.build('platform/Makefile'))
        .then(util.runBuiltExecutable())
        .then(util.matchOutput());
    });

    it('should fail with "Too many arguments" if too many non-flag arguments are passed', function () {
        return shell.exec(util.frontEndExecutable + ' file.json file2.json', {cwd: 'temp'}).then(function () {
            return Promise.reject(new Error('Did not fail'));
        }, function (error) {
            return error.stdout.should.containEql('Too many arguments');
        });
    });

    it('should fail with "No configuration file" if no config file is provided', function () {
        return shell.exec(util.frontEndExecutable, {cwd: 'temp'}).then(function () {
            return Promise.reject(new Error('Did not fail'));
        }, function (error) {
            return error.stdout.should.containEql('No configuration file');
        });
    });

    it('should output usage information if given the --help flag', function () {
        return shell.exec(util.frontEndExecutable + ' --help', {cwd: 'temp'}).then(function (result) {
            return result.stdout.should.containEql('Usage:');
        });
    });

    it('should fail with "Flag <flag> is missing a value" if a flag requiring a value is missing one', function () {
        return Promise.all([
            shell.exec(util.frontEndExecutable + ' --host', {cwd: 'temp'}).then(function () {
                return Promise.reject(new Error('Did not fail'));
            }, function (error) {
                return error.stdout.should.containEql('Flag --host is missing a value');
            }),
            shell.exec(util.frontEndExecutable + ' --outputPath', {cwd: 'temp'}).then(function () {
                return Promise.reject(new Error('Did not fail'));
            }, function (error) {
                return error.stdout.should.containEql('Flag --outputPath is missing a value');
            })
        ]);
    });

    it('should fail if the config file is not valid JSON', function () {
        return util.testConfiguration(
            "{ title: 'app', type: 'application', host: 'linux', files: ['test.c'], outputName: 'name' }"
        ).should.be.rejected();
    });

    it('should fail with "Unknown flag \'<flag>\'" if given an unknown flag', function () {
        return util.writeConfiguration(minimal.project())
        .then(util.generateWithParameters('--some-flag value'))
        .then(function () {
            return Promise.reject(new Error('Did not fail'));
        }, function (error) {
            return error.message.should.containEql("Unknown flag '--some-flag'");
        })
    });
});

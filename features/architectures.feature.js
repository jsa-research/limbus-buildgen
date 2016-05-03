
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var should = require('should');
var util = require('./util.js');
var shell = require('./shell.js');
var minimal = require('../source/minimal-configuration');

describe('Architectures', function () {
    beforeEach(function () {
        return util.beforeEach();
    });

    afterEach(function () {
        return util.afterEach();
    });

    it('should compile for the correct architecture', function () {
        var builtExecutable = util.writeConfiguration(minimal.projectWithArtifactWith({
            host: util.host
        }))
        .then(util.generateWithParameters())
        .then(util.build());

        if (process.platform === 'win32') {
            return builtExecutable.then(function (executable) {
                return shell.exec('..\\utility-scripts\\setenv.bat ' + util.hostArchitecture + '&& dumpbin /nologo /headers ' + executable + '.exe', {cwd: 'temp'});
            }).then(function (output) {
                if (output.stdout.indexOf('PE32+') !== -1) {
                    util.hostArchitecture.should.equal('x64');

                } else if (output.stdout.indexOf('PE32') !== -1) {
                    util.hostArchitecture.should.equal('x86');

                } else {
                    return Promise.reject('Unknown platform:\n' + output.stdout);
                }
            });
        } else {
            return builtExecutable.then(function (executable) {
                return shell.exec('file ' + executable, {cwd: 'temp'});
            }).then(function (output) {
                if (output.stdout.indexOf('64-bit') !== -1) {
                    util.hostArchitecture.should.equal('x64');

                } else if (output.stdout.indexOf('86') !== -1) {
                    util.hostArchitecture.should.equal('x86');

                } else {
                    return Promise.reject('Unknown platform:\n' + output.stdout);
                }
            });
        }
    });
});

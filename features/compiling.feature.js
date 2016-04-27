
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

describe('Compiling', function () {
    beforeEach(function () {
        return util.beforeEach().then(function () {
            return shell.mkdir('temp/some_directory');
        }).then(function () {
            return shell.cp('temp/simple.c', 'temp/some_directory/');
        });
    });

    afterEach(function () {
        return util.afterEach();
    });

    it('should pass compiler flags as is', function () {
        return util.buildSimple(util.minimalProjectWithArtifactProperties({
            compilerFlags: util.hostCompiler === 'cl' ? '/X' : '-S'
        })).should.be.rejected();
    });

    it('should accept input files with paths', function () {
        return util.buildSimple(util.minimalProjectWithArtifactProperties({
            files: ['./some_directory/simple.c']
        }));
    });
});

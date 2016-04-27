
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

describe('Paths', function () {
    beforeEach(function () {
        return util.beforeEach().then(function () {
            return shell.mkdir('temp/abc');
        });
    });

    afterEach(function () {
        return util.afterEach();
    });

    it('should use the outputPath', function () {
        return util.buildSimple(util.minimalArtifactWith({
            files: ['simple.c'],
            outputPath: 'abc'
        }), 'abc/app');
    });

    it('should remove trailing path separators from outputPath', function () {
        return util.buildSimple(util.minimalArtifactWith({
            files: ['simple.c'],
            outputPath: 'abc/'
        }), 'abc/app');
    });

    it('should treat an empty outputPath as none was given', function () {
        return util.buildSimple(util.minimalArtifactWith({
            files: ['simple.c'],
            outputPath: ''
        }), 'app');
    });
});

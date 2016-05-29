
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
var util = require('./util.js');
var minimal = require('../source/minimal-configuration');

describe('Makefiles', function () {
    beforeEach(function () {
        return util.beforeEach();
    });

    afterEach(function () {
        return util.afterEach();
    });

    it('should be able to override makefile variables from commandline', function () {
        return util.writeConfiguration(minimal.project())
        .then(util.generateWithParameters())
        .then(util.build(undefined, { CC: 'invalid-compiler' }))
        .should.be.rejected();
    });
});

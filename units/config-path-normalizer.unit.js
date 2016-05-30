
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

'use strict';

var should = require('should');
var ConfigPathNormalizer = require('../source/config-path-normalizer');

describe('config-path-normalizer', function () {
    describe('normalize', function () {
        it('should add a trailing slash to outputPath if none exists', function () {
            var config = { outputPath: 'path' };
            ConfigPathNormalizer.normalize(config);
            config.outputPath.should.equal('path/');
        });

        it('should not add a trailing slash if one already exists', function () {
            var config = { outputPath: 'path/' };
            ConfigPathNormalizer.normalize(config);
            config.outputPath.should.equal('path/');
        });

        it('should not add a slash if outputPath is empty', function () {
            var config = { outputPath: '' };
            ConfigPathNormalizer.normalize(config);
            config.outputPath.should.equal('');
        });

        it('should do nothing when outputPath is undefined', function () {
            var config = {};
            ConfigPathNormalizer.normalize(config);
            should(config.outputPath).be.undefined();
        });
    });
});

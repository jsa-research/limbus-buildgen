
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var should = require('should');
var util = require('../units/util.js');

exports.injectCompilerInterfaceSpecs = function (generator) {
    it('should include extra compiler flags', function () {
        var compilerCommand = generator({
            file: 'file.c',
            flags: '--some-compiler-flag'
        });

        compilerCommand.should.containEql('--some-compiler-flag');
    });

    describe('Error Handling', function () {
        it('should throw "include_paths_is_not_a_string_array" if includePaths is anything other than an array of strings', function () {
            util.should_throw_not_string_array_error(generator, { file: 'test' }, 'includePaths');
        });

        it('should throw "no_file" if no file is given', function () {
            (function () {
                generator({});
            }).should.throw('no_file');
        });

        it('should throw "file_is_not_a_string" if file is anything other than a string', function () {
            util.should_throw_not_string_error(generator, {}, 'file');
        });

        it('should throw "flags_is_not_a_string" if flags is anything other than a string', function () {
            util.should_throw_not_string_error(generator, {file: 'test'}, 'flags');
        });
    });
};

exports.injectLinkerInterfaceSpecs = function (generator) {
    it('should include extra linker flags', function () {
        var linkerCommand = generator({
            objectFiles: [
                'file.obj'
            ],
            outputName: 'name',
            type: 'application',
            flags: '--some-linker-flag'
        });

        linkerCommand.should.containEql('--some-linker-flag');
    });

    describe('Error Handling', function () {
        it('should throw "libraries_is_not_a_string_array" if libraries is anything other than an array of strings', function () {
            util.should_throw_not_string_array_error(generator, {objectFiles: ['test'], outputName: 'test', type: 'application'}, 'libraries');
        });

        it('should throw "no_output_name" if no outputName is given', function () {
            (function () {
                generator({
                    objectFiles: [
                        'test'
                    ],
                    type: 'application'
                });
            }).should.throw('no_output_name');
        });

        it('should throw "output_name_is_not_a_string" if outputName is anything other than a string', function () {
            util.should_throw_not_string_error(generator, {objectFiles: ['test'], type: 'application'}, 'outputName');
        });

        it('should throw "no_object_files" if no object files are given', function () {
            (function () {
                generator({
                    outputName: 'test',
                    type: 'application'
                });
            }).should.throw('no_object_files');

            (function () {
                generator({
                    outputName: 'test',
                    objectFiles: [],
                    type: 'application'
                });
            }).should.throw('no_object_files');
        });

        it('should throw "object_files_is_not_a_string_array" if objectFiles is anything other than an array of strings', function () {
            util.should_throw_not_string_array_error(generator, { outputName: 'test', type: 'application' }, 'objectFiles');
        });

        it('should throw "invalid_type" if type is not "static-library" nor "application"', function () {
            (function () {
                generator({
                    outputName: 'test',
                    objectFiles: ['test']
                });
            }).should.throw('invalid_type');

            (function () {
                generator({
                    outputName: 'test',
                    objectFiles: ['test'],
                    type: 'something-else'
                });
            }).should.throw('invalid_type');
        });

        it('should throw "flags_is_not_a_string" if flags is anything other than a string', function () {
            util.should_throw_not_string_error(generator, {objectFiles: ['test'], type: 'application', outputName: 'name'}, 'flags');
        });

        it('should throw "linking_libraries_is_not_valid_for_static_libraries" if given libraries to link while type is "static-library"', function () {
            (function () {
                generator({
                    type: 'static-library',
                    objectFiles: ['test'],
                    outputName: 'name',
                    libraries: ['alibrary']
                });
            }).should.throw('linking_libraries_is_not_valid_for_static_libraries');
        });
    });
};

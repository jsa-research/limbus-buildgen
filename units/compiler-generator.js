
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
            type: 'application',
            file: 'file.c',
            flags: '--some-compiler-flag'
        });

        compilerCommand.should.containEql('--some-compiler-flag');
    });

    it('should take a path as file', function () {
        var compilerCommand = generator({
            type: 'application',
            file: './some/path/to/file.c'
        });

        compilerCommand.should.match(/\.[\/\\]some[\/\\]path[\/\\]to[\/\\]file\.c/);
    });

    describe('Error Handling', function () {
        describe('type', function () {
            it('should throw "no_type" if no type is given', function () {
                (function () {
                    generator({
                        file: 'file.c'
                    });
                }).should.throw('no_type');
            });

            it('should throw "type_is_not_a_string" if type is anything other than a string', function () {
                util.should_throw_not_string_error(generator, {
                    file: 'file.c'
                }, 'type');
            });

            it('should throw "invalid_type" if type is not "static-library", "dynamic-library" nor "application"', function () {
                (function () {
                    generator({
                        file: 'file.c',
                        type: 'something-else'
                    });
                }).should.throw('invalid_type');
                
                ['static-library', 'dynamic-library', 'application'].forEach(function (type) {
                    (function () {
                        generator({
                            file: 'file.c',
                            type: type
                        });
                    }).should.not.throw('invalid_type');
                });
            });
        });

        describe('file', function () {
            it('should throw "no_file" if no file is given', function () {
                (function () {
                    generator({
                        type: 'application',
                    });
                }).should.throw('no_file');
            });

            it('should throw "file_is_not_a_string" if file is anything other than a string', function () {
                util.should_throw_not_string_error(generator, {
                    type: 'application',
                }, 'file');
            });
        });

        describe('flags', function () {
            it('should throw "flags_is_not_a_string" if flags is anything other than a string', function () {
                util.should_throw_not_string_error(generator, {
                    type: 'application',
                    file: 'test'
                }, 'flags');
            });
        });

        describe('includePaths', function () {
            it('should throw "include_paths_is_not_a_string_array" if includePaths is anything other than an array of strings', function () {
                util.should_throw_not_string_array_error(generator, {
                    type: 'application',
                    file: 'test'
                }, 'includePaths');
            });
        });
    });
};

exports.injectLinkerInterfaceSpecs = function (generator) {
    it('should include extra linker flags', function () {
        var linkerCommand = generator({
            type: 'application',
            objectFiles: [
                'file.obj'
            ],
            outputName: 'name',
            flags: '--some-linker-flag'
        });

        linkerCommand.should.containEql('--some-linker-flag');
    });

    describe('outputPath', function () {
        it('should be prepended to outputName if given', function () {
            var linkerCommand = generator({
                type: 'application',
                objectFiles: [
                    'file.obj'
                ],
                outputName: 'name',
                outputPath: 'some/directory'
            });

            linkerCommand.should.containEql('some/directory/name');
        });

        it('should handle trailing slashes', function () {
            var linkerCommand = generator({
                type: 'application',
                objectFiles: [
                    'file.obj'
                ],
                outputName: 'name',
                outputPath: 'some/directory/'
            });

            linkerCommand.should.containEql('some/directory/name');
        });
    });

    describe('Error Handling', function () {
        describe('outputName', function () {
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

            it('should throw "output_name_does_not_take_a_path" if outputName is given a path', function () {
                (function () {
                    generator({
                        objectFiles: [
                            'test'
                        ],
                        type: 'application',
                        outputName: 'name/with/path'
                    });
                }).should.throw('output_name_does_not_take_a_path');
            });

            it('should throw "output_name_is_not_a_string" if outputName is anything other than a string', function () {
                util.should_throw_not_string_error(generator, {
                    objectFiles: ['test'],
                    type: 'application'
                }, 'outputName');
            });
        });
        
        describe('outputPath', function () {
            it('should throw "output_path_is_not_a_string" if outputPath is anything other than a string', function () {
                util.should_throw_not_string_error(generator, {
                    type: 'application',
                    objectFiles: ['test'],
                    outputName: 'name'
                }, 'outputPath');
            });
        });

        describe('objectFiles', function () {
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
                util.should_throw_not_string_array_error(generator, {
                    outputName: 'test',
                    type: 'application'
                }, 'objectFiles');
            });
        });

        describe('type', function () {
            it('should throw "no_type" if no type is given', function () {
                (function () {
                    generator({
                        objectFiles: [
                            'test'
                        ],
                        outputName: 'test'
                    });
                }).should.throw('no_type');
            });

            it('should throw "type_is_not_a_string" if type is anything other than a string', function () {
                util.should_throw_not_string_error(generator, {
                    objectFiles: ['test'],
                    outputName: 'name'
                }, 'type');
            });

            it('should throw "invalid_type" if type is not "static-library", "dynamic-library" nor "application"', function () {
                (function () {
                    generator({
                        outputName: 'test',
                        objectFiles: ['test'],
                        type: 'something-else'
                    });
                }).should.throw('invalid_type');
                
                ['static-library', 'dynamic-library', 'application'].forEach(function (type) {
                    (function () {
                        generator({
                            outputName: 'test',
                            objectFiles: ['test'],
                            type: type
                        });
                    }).should.not.throw('invalid_type');
                });
            });
        });

        describe('flags', function () {
            it('should throw "flags_is_not_a_string" if flags is anything other than a string', function () {
                util.should_throw_not_string_error(generator, {
                    objectFiles: ['test'],
                    type: 'application',
                    outputName: 'name'
                }, 'flags');
            });
        });

        describe('libraries', function () {
            it('should throw "libraries_is_not_a_string_array" if libraries is anything other than an array of strings', function () {
                util.should_throw_not_string_array_error(generator, {
                    objectFiles: ['test'],
                    outputName: 'test',
                    type: 'application'
                }, 'libraries');
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
    });
};


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
var ClCompilerGenerator = require('../source/cl-compiler-generator');

var camelToSnakeCase = function (input) {
    return input.replace(/([a-z])([A-Z])/g, function (match, a, b) {
        return a + '_' + b.toLowerCase();
    });
};

var should_throw_type_error = function (permutations, errorSuffix, generator, baseOptions, option, error) {
    permutations.forEach(function (permutationToTry) {
        baseOptions[option] = permutationToTry;
        (function () { generator(baseOptions); }).should.throw(camelToSnakeCase(option) + errorSuffix);
    });
};

var should_throw_not_string_array_error = function (generator, baseOptions, option, error) {
    var permutations = [
        ['', 1],
        ['', {}],
        ['', null],
        ['', NaN],
        ['', []],
        {},
        1,
        '',
        null,
        NaN
    ];
    should_throw_type_error(permutations, '_is_not_a_string_array', generator, baseOptions, option, error);
};

var should_throw_not_string_error = function (generator, baseOptions, option, error) {
    var permutations = [
        [], {}, 1, NaN, null
    ];
    should_throw_type_error(permutations, '_is_not_a_string', generator, baseOptions, option, error);
};

describe('cl-compiler-generator', function () {
    describe('Compiling', function () {
        it('should compile a file into an object file with the same name', function () {
            var compilerCommand = ClCompilerGenerator.compilerCommand({
                file: 'test.c'
            });

            compilerCommand.should.match(/^cl \/c /);
            compilerCommand.should.containEql('test.c');
            compilerCommand.should.containEql('/Fetest.obj');

            var compilerCommand = ClCompilerGenerator.compilerCommand({
                file: 'anotherFile.c'
            });

            compilerCommand.should.containEql('anotherFile.c');
            compilerCommand.should.containEql('/FeanotherFile.obj');
        });

        it('should add any specified include paths in includePaths', function () {
            var compilerCommand = ClCompilerGenerator.compilerCommand({
                file: 'test.c',
                includePaths: [
                    'include_path',
                    'other_path'
                ]
            });

            compilerCommand.should.match(/\/Iinclude_path/);
            compilerCommand.should.match(/\/Iother_path/);
        });

        it('should convert paths to use backslashes instead of forward ones', function () {
            var compilerCommand = ClCompilerGenerator.compilerCommand({
                file: 'in/some/path/test.c',
                includePaths: [
                    'some/include/path'
                ]
            });

            compilerCommand.should.match(/some\\include\\path/);
            compilerCommand.should.match(/in\\some\\path\\test.c/);
            compilerCommand.should.match(/in\\some\\path\\test.obj/);
        });

        describe('Error Handling', function () {
            it('should throw "include_paths_is_not_a_string_array" if includePaths is anything other than an array of strings', function () {
                should_throw_not_string_array_error(ClCompilerGenerator.compilerCommand, { file: 'test' }, 'includePaths');
            });

            it('should throw "no_file" if no file is given', function () {
                (function () {
                    ClCompilerGenerator.compilerCommand({});
                }).should.throw('no_file');
            });

            it('should throw "file_is_not_a_string" if file is anything other than a string', function () {
                should_throw_not_string_error(ClCompilerGenerator.compilerCommand, {}, 'file');
            });
        });
    });

    describe('Linking', function () {
        it('should link several object files into one executable with outputName', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                objectFiles: [
                    'filea.obj',
                    'fileb.obj'
                ],
                outputName: 'executable',
                type: 'application'
            });

            linkerCommand.should.match(/^cl /);
            linkerCommand.should.containEql('filea.obj');
            linkerCommand.should.containEql('fileb.obj');
            linkerCommand.should.containEql('/Feexecutable');
        });

        it('should link with any specified libraries in libraries', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                objectFiles: [
                    'file.obj'
                ],
                libraries: [
                    'mylibrary',
                    'anotherlibrary'
                ],
                outputName: 'executable',
                type: 'application'
            });

            linkerCommand.should.containEql('mylibrary.lib');
            linkerCommand.should.containEql('anotherlibrary.lib');
        });

        it('should convert paths to use backslashes instead of forward ones', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                objectFiles: [
                    'object/file/in/a/path.obj'
                ],
                outputName: 'does_not_have_a_path',
                type: 'application'
            });

            linkerCommand.should.match(/object\\file\\in\\a\\path.obj/);
        });
        
        it('should link as a static library if "type" === "static-library"', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                objectFiles: [
                    'file.obj'
                ],
                outputName: 'name',
                type: 'static-library'
            });

            linkerCommand.should.match(/^lib \/OUT:name\.lib/);
        });

        describe('Error Handling', function () {
            it('should throw "libraries_is_not_a_string_array" if libraries is anything other than an array of strings', function () {
                should_throw_not_string_array_error(ClCompilerGenerator.linkerCommand, {objectFiles: ['test'], outputName: 'test', type: 'application'}, 'libraries');
            });

            it('should throw "no_output_name" if no outputName is given', function () {
                (function () {
                    ClCompilerGenerator.linkerCommand({
                        objectFiles: [
                            'test'
                        ],
                        type: 'application'
                    });
                }).should.throw('no_output_name');
            });

            it('should throw "output_name_is_not_a_string" if outputName is anything other than a string', function () {
                should_throw_not_string_error(ClCompilerGenerator.linkerCommand, {objectFiles: ['test'], type: 'application'}, 'outputName');
            });

            it('should throw "no_object_files" if no object files are given', function () {
                (function () {
                    ClCompilerGenerator.linkerCommand({
                        outputName: 'test',
                        type: 'application'
                    });
                }).should.throw('no_object_files');

                (function () {
                    ClCompilerGenerator.linkerCommand({
                        outputName: 'test',
                        objectFiles: [],
                        type: 'application'
                    });
                }).should.throw('no_object_files');
            });

            it('should throw "object_files_is_not_a_string_array" if objectFiles is anything other than an array of strings', function () {
                should_throw_not_string_array_error(ClCompilerGenerator.linkerCommand, { outputName: 'test', type: 'application' }, 'objectFiles');
            });
            
            it('should throw "invalid_type" if type is not "static-library" nor "application"', function () {
                (function () {
                    ClCompilerGenerator.linkerCommand({
                        outputName: 'test',
                        objectFiles: ['test']
                    });
                }).should.throw('invalid_type');

                (function () {
                    ClCompilerGenerator.linkerCommand({
                        outputName: 'test',
                        objectFiles: ['test'],
                        type: 'something-else'
                    });
                }).should.throw('invalid_type');
            });
        });
    });
});

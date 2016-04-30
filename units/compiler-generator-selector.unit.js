
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
var CompilerGeneratorSelector = require('../source/compiler-generator-selector');

var gcc = {name: 'gcc'};
var clang = {name: 'clang'};
var cl = {name: 'cl'};

var compilers = {
    'gcc': gcc,
    'clang': clang,
    'cl': cl
};

describe('compiler-generator-selector', function () {
    describe('linkerCommand', function () {
        describe('GNU GCC', function () {
            var compiler = gcc;

            it('should be selected given linux', function () {
                CompilerGeneratorSelector.select('linux', compilers).should.be.exactly(compiler);
            });

            it('should be selected given linux-gcc', function () {
                CompilerGeneratorSelector.select('linux-gcc', compilers).should.be.exactly(compiler);
            });

            it('should be selected given freebsd-gcc', function () {
                CompilerGeneratorSelector.select('freebsd-gcc', compilers).should.be.exactly(compiler);
            });

            it('should be selected given darwin-gcc', function () {
                CompilerGeneratorSelector.select('darwin-gcc', compilers).should.be.exactly(compiler);
            });
        });

        describe('LLVM Clang', function () {
            var compiler = clang;

            it('should be selected given freebsd', function () {
                CompilerGeneratorSelector.select('freebsd', compilers).should.be.exactly(compiler);
            });

            it('should be selected given darwin', function () {
                CompilerGeneratorSelector.select('darwin', compilers).should.be.exactly(compiler);
            });

            it('should be selected given linux-clang', function () {
                CompilerGeneratorSelector.select('linux-clang', compilers).should.be.exactly(compiler);
            });

            it('should be selected given freebsd-clang', function () {
                CompilerGeneratorSelector.select('freebsd-clang', compilers).should.be.exactly(compiler);
            });

            it('should be selected given darwin-clang', function () {
                CompilerGeneratorSelector.select('darwin-clang', compilers).should.be.exactly(compiler);
            });
        });

        describe('Visual Studio CL', function () {
            var compiler = cl;

            it('should be selected given win32', function () {
                CompilerGeneratorSelector.select('win32', compilers).should.be.exactly(compiler);
            });

            it('should be selected given win32-cl', function () {
                CompilerGeneratorSelector.select('win32-cl', compilers).should.be.exactly(compiler);
            });
        });
    });
});


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

var testSelectionFor = function (compiler, hosts) {
    hosts.forEach(function (host) {
        it('should be selected given ' + host, function () {
            CompilerGeneratorSelector.select(host, compilers).should.be.exactly(compiler);
        });
    });
};

describe('compiler-generator-selector', function () {
    describe('linkerCommand', function () {
        describe('GNU GCC', function () {
            var compiler = gcc;
            var hosts = [
                'linux',
                'linux-make-gcc-linux-x86',
                'linux-make-gcc-linux-x64',
                'freebsd-make-gcc-freebsd-x64',
                'darwin-make-gcc-darwin-x86',
                'darwin-make-gcc-darwin-x64'
            ];

            testSelectionFor(compiler, hosts);
        });

        describe('LLVM Clang', function () {
            var compiler = clang;
            var hosts = [
                'freebsd',
                'darwin',
                'linux-make-clang-linux-x86',
                'linux-make-clang-linux-x64',
                'freebsd-make-clang-freebsd-x86',
                'freebsd-make-clang-freebsd-x64',
                'darwin-make-clang-darwin-x86',
                'darwin-make-clang-darwin-x64'
            ];

            testSelectionFor(compiler, hosts);
        });

        describe('Microsoft CL', function () {
            var compiler = cl;
            var hosts = [
                'win32',
                'win32-make-cl-win32-x86',
                'win32-make-cl-win32-x64'
            ];

            testSelectionFor(compiler, hosts);
        });
    });
});


// sea-strap.js - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var should = require('should');
var shell = require('shelljs');
var util = require('./makefile-generator.util.js');

describe('makefile-generator-linking', function () {
    beforeEach(function (done) {
        util.setupEnvironment(function () {
            shell.mkdir('include');
            shell.mkdir('source');

            /* Includes and linking */
            ("#include <mylibrary.h>\n"
            +"int main(int argc, char** argv) {\n"
            +"  return (add(23, 88) == 111) ? 0 : -1;\n"
            +"}\n").to("linked.c");

            ("#include <stdio.h>\n"
            +"#include \"../include/mylibrary.h\"\n"
            +"int add(int a, int b) {\n"
            +"  return a + b;\n"
            +"}\n").to("source/mylibrary.c");

            ("int add(int a, int b);\n").to("include/mylibrary.h");
            
            done();
        });
    });

    afterEach(util.teardownEnvironment);

    it('should compile and link correctly given several source files and includes', function (done) {
        util.compileAndRunConfig({
            files: [
                'linked.c',
                'source/mylibrary.c'
            ],
            includePaths: [
                'include'
            ]
        }, './linked', done);
    });
});

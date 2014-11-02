
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
var makefile_generator = require('../source/makefile-generator');
var shell = require('shelljs');

describe('makefile-generator', function () {
    beforeEach(function () {
        shell.mkdir('temp');
        shell.cd('temp');
        
        ("#include <stdio.h>\n"
        +"int main(int argc, char** argv) {\n"
        +"  return 0;\n"
        +"}\n").to("simple.c");
    });
    
    afterEach(function () {
        shell.cd('..');
        shell.rm('-Rf', 'temp');
    });
    
    it('compile single files', function (done) {
        makefile_generator.generate({
            files: [
                'simple.c'
            ]
        }).to('Makefile');
        
        shell.exec('make', {silent: true}, function (returnValue, output) {
            if (returnValue !== 0) {
                throw new Error(output);
            }
            
            shell.exec('./simple', {silent: true}, function (returnValue, output) {
                if (returnValue !== 0) {
                    throw new Error(output);
                }
                
                done();
            });
        });
    });
});


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
var fs = require('fs');
var util = require('./util.js');
var shell = require('../source/shell.js');

var javascript_examples = [];
var json_examples = [];

var readme = fs.readFileSync('README.md').toString();
readme.replace(/```javascript([\s\S]+?)```/gi, function (match, example) {
    javascript_examples.push(example);
    return match;
});
readme.replace(/```json([\s\S]+?)```/gi, function (match, example) {
    json_examples.push(example);
    return match;
});


var setup = function () {
    fs.writeFileSync(
        "temp/main.c",

         "int main(int argc, char** argv) {\n"
        +"  return 0;\n"
        +"}\n");
};

describe('README Examples', function () {
    it('should compile and run all examples successfully', function (done) {
        util.forEachAsync(javascript_examples, function (example, index, done) {
            shell.mkdirClean('temp', null, function (done) {
                fs.writeFileSync('temp/example.js', example);
                shell.exec(shell.path('./duk') + ' ' + shell.path('temp/example.js'), {cwd: null}, done);
            }, done);
        }, function (error) {
            if (error) {
                return done(error);
            } else {
                util.forEachAsync(json_examples, function (example, index, done) {
                    var config = JSON.parse(example);
                    config.outputName = 'example';
                    config.host = process.platform;

                    util.generateCompileAndRun({
                        setup: setup,
                        config: config,
                        command: 'example'
                    }, done);
                }, done);
            }
        });
    });
});

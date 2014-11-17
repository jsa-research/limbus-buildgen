
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

var generateWithExample = function (example, done) {
    shell.mkdirClean('temp', null, function (done) {
        fs.writeFileSync('temp/example.js', example);
        shell.exec(shell.path('./duk') + ' ' + shell.path('temp/example.js'), {cwd: null}, done);
    }, done);
};

describe('README Examples', function () {
    describe('Javascript API examples', function () {
        it('should run without throwing errors', function (done) {
            util.forEachAsync(javascript_examples, function (example, index, done) {
                return generateWithExample(example, done);
            }, done);
        });
    });

    describe('JSON configurations', function () {
        it('should generate successfully using makefile-generator', function (done) {
            util.forEachAsync(json_examples, function (json, index, done) {
                var example = "require('source/makefile-generator').generate(" + json + ");";
                return generateWithExample(example, done);
            }, done);
        });

        it('should actually be valid JSON', function () {
            json_examples.forEach(function (json) {
                JSON.parse(json);
            });
        });
    });
});

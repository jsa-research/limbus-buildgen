
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

var javascriptExamples = [];
var jsonExamples = [];
var usageInformation;

var readme = fs.readFileSync('README.md').toString();
readme.replace(/```javascript([\s\S]+?)```/gi, function (match, example) {
    javascriptExamples.push(example);
    return match;
});
readme.replace(/```json([\s\S]+?)```/gi, function (match, example) {
    jsonExamples.push(example);
    return match;
});
readme.replace(/## Use[\s\S]+?```([\s\S]+?)```/, function (match, info) {
    usageInformation = info;
    return match;
});


var setup = function () {
    fs.writeFileSync(
        "temp/main.c",
        fs.readFileSync("features/readme-examples/main.c"));
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
            util.forEachAsync(javascriptExamples, function (example, index, done) {
                return generateWithExample(example, done);
            }, done);
        });
    });

    describe('JSON configurations', function () {
        it('should generate successfully using makefile-generator', function (done) {
            util.forEachAsync(jsonExamples, function (json, index, done) {
                var example = "require('source/makefile-generator').generate(" + json + ");";
                return generateWithExample(example, done);
            }, done);
        });

        it('should actually be valid JSON', function () {
            jsonExamples.forEach(function (json) {
                JSON.parse(json);
            });
        });
    });

    describe('Usage information', function () {
        var usageCommand = shell.path('./duk') + ' ' + shell.path('./limbus-buildgen.js') + ' --help';
        it('should match the output of `' + usageCommand + '`', function (done) {
            shell.exec(usageCommand, {cwd: null}, function (error, stdout, stderr) {
                usageInformation.replace(/\r\n/g, '\n').should.containEql(stdout.replace(/\r\n/g, '\n'));
                done();
            });
        });
    });
});

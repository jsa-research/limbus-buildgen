
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

require('should');
var Promise = require('promise');
var fs = require('fs');
var util = require('./util.js');
var shell = require('./shell.js');

var javascriptExamples = [];
var jsonExamples = [];
var jsonExampleExpressions = [];
var usageInformation = '';

var readme = fs.readFileSync('README.md').toString();

readme.replace(/```javascript([\s\S]+?)```/gi, function (match, example) {
    example = example.replace(/require\('limbus\-buildgen'\)/g, 'require("../source/limbus-buildgen")');
    javascriptExamples.push(example);
    return match;
});
readme.replace(/```json([\s\S]+?)```/gi, function (match, example) {
    jsonExamples.push(example);
    jsonExampleExpressions.push('require("../source/limbus-buildgen").generate(' + example + ');');
    return match;
});
readme.replace(/```(\s+Usage:[\s\S]+?)```/, function (match, info) {
    usageInformation = info;
    return match;
});

var generateWithExample = function (example) {
    return Promise.resolve()
    .then(function () {
        return util.writeFile('temp/example.js', Promise.resolve(example));
    })
    .then(function () {
        return shell.exec('node ' + shell.path('example.js'), { cwd: './temp' });
    });
};

var generateExamples = function (examples) {
    var promise = Promise.resolve();

    examples.forEach(function (example) {
        promise = promise.then(function () {
            return generateWithExample(example);
        });
    });

    return promise;
};

describe('README Examples', function () {
    beforeEach(function () {
        return util.beforeEach()
        .then(function () {
            return shell.copyFiles([
                'main.c'
            ], 'features/readme-examples/', 'temp/');
        });
    });

    afterEach(function () {
        return util.afterEach();
    });

    describe('Javascript API examples', function () {
        it('should run without throwing errors', function () {
            return generateExamples(javascriptExamples);
        });
    });

    describe('JSON configurations', function () {
        it('should generate successfully using makefile-generator', function () {
            return generateExamples(jsonExampleExpressions);
        });

        it('should actually be valid JSON', function () {
            jsonExamples.forEach(function (json) {
                JSON.parse(json);
            });
        });
    });

    describe('Usage information', function () {
        var usageCommand = shell.path('generated/limbus-buildgen') + ' --help';

        it('should match the output of `' + usageCommand + '`', function () {
            return shell.exec(usageCommand)
            .then(function (result) {
                return usageInformation.replace(/\r\n/g, '\n').should.containEql(result.stdout.replace(/\r\n/g, '\n'));
            });
        });
    });
});

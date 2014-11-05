# sea-strap.js
_A "build anywhere" C/C++ makefile/project generator._

[![travis-ci build status](https://travis-ci.org/redien/sea-strap.js.svg?branch=master)](https://travis-ci.org/redien/sea-strap.js) [![Coverage Status](https://img.shields.io/coveralls/redien/sea-strap.js.svg)](https://coveralls.io/r/redien/sea-strap.js) [![Dependencies](https://david-dm.org/redien/sea-strap.js.svg)](https://david-dm.org/redien/sea-strap.js) [![devDependencies](https://david-dm.org/redien/sea-strap.js/dev-status.svg)](https://david-dm.org/redien/sea-strap.js#info=devDependencies) [![Public Domain](http://img.shields.io/badge/public%20domain%3F-yes-blue.svg)](http://creativecommons.org/publicdomain/zero/1.0/)

The goal of this project is to have a javascript library and companioning command-line application that can generate build files for a wide variety of platforms to build small and portable C/C++ code-bases. The aim is to keep the code-base small and as such features will be added only if there is a real need for something that would be used by most projects.

The library consists of a collection of Common.js modules that generate different types of build files. There is also a small command-line front-end that can be used to generate build files without writing additional code.

**Currently bootstrapping itself and as such is not very useful...**

## Compile
sea-strap.js compiles using build files that it generated itself. The build process tries to follow the conventions of the platform.

#### Linux/OS X/FreeBSD
Run `make` in the project root directory to build.

#### Windows
You will need to download some dependencies manually, see [Download dependencies manually](#download-dependencies-manually).

When you have the dependencies, open "VS2013 x86 Native Tools Command Prompt" and run `nmake /f Makefile.mak` in the project root directory.

## Use
To use, just run:
```
./duk sea-strap.js freebsd > Makefile.freebsd
./duk sea-strap.js linux > Makefile.linux
./duk sea-strap.js darwin > Makefile.darwin
./duk sea-strap.js win32 > Makefile.mak
```

(_Note: At the moment this only builds bootstrap makefiles for itself. Not very useful..._)

## API
#### Generate Makefiles
```javascript
var makefile_generator = require('source/makefile-generator');

// Returns a string with the generated makefile.
var makefile = makefile_generator.generate({
  // Specifies a list of source files
  files: [
    'main.c'
  ],
  // Specifies where to find header files to include
  includePaths: [
    'include/'
  ],
  // Specifies the target host, i.e. the desired platform that the makefile should compile with
  host: 'darwin-clang',
  // Specifies the name of the final executable
  outputName: 'my-application'
});
```

## Test
As sea-strap.js uses mocha and should.js to perform testing, first make sure they are installed with:
```
npm install -g mocha
npm install
```

Then run both unit- and integration tests using `npm test`

To run each separately, use `npm run-script unit-test` for unit tests and `npm run-script integration-test` for integration tests.

## Code coverage
sea-strap.js analyzes code coverage using blanket.js.

To produce a report, run:
```
npm run-script coverage
```

This will generate a file named `coverage.html` in the project root directory which can be viewed in a browser.

## Download dependencies manually
sea-strap.js uses Duktape as its Javascript interpreter. You can download Duktape from `http://duktape.org/` and extract it into `dependencies/duktape-1.0.1`. Version 1.0.1 is currently used.

## Roadmap
These are things that are planned for a 0.2 version:
* A Visual Studio 2013 project generator.
* Research continous integration on all supported platforms

Towards a 1.0 release, these features are planned:
* Cross compilation to Android on supported platforms.
* A Xcode 6 project generator for iOS cross compilation.

## Copy
sea-strap.js - A "build anywhere" C/C++ makefile/project generator.

Written in 2014 by Jesper Oskarsson jesosk@gmail.com

To the extent possible under law, the author(s) have dedicated all copyright
and related and neighboring rights to this software to the public domain worldwide.
This software is distributed without any warranty.

You should have received a copy of the CC0 Public Domain Dedication along with this software.
If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

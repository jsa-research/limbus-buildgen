# sea-strap.js
_A "build anywhere" C/C++ makefile/project generator._

The goal of the project is to have a javascript library and companioning command-line application that can generate build files for a wide variety of platforms to build small and portable C/C++ code-bases.

It consists of a collection of Common.js modules that generate different types of build files. It also has a small command-line front-end that can be used to generate build files without writing additional code.

*Currently bootstrapping itself and as such is not very useful...*

## Compile
sea-strap.js compiles using build files that it generated itself. The build process tries to follow the conventions of the platform.

#### Linux/OS X/FreeBSD
Run `make` in the root folder to build the project.

#### Windows
You will need to download some dependencies manually, see [Download dependencies manually](#download-dependencies-manually).

When you have the dependencies, open "VS2013 x86 Native Tools Command Prompt" and run `nmake /f Makefile.mak` in the root folder.

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

Then run both unit- and integration tests using `npm test` (_Currently this is broken on Windows. Run the tests separately instead._)

To run each separately, use `npm run-script unit-test` for unit tests and `npm run-script integration-test` for integration tests.

## Code coverage
To analyze code coverage of the unit tests, sea-strap.js uses blanket.js.

To produce a report, run:
```
npm run-script coverage
```

This will generate `coverage.html` that can be viewed in a browser.

## Download dependencies manually
Download and extract Duktape from `http://duktape.org/` and extract into `dependencies/duktape-1.0.1`.
Version 1.0.1 is currently used.

## Roadmap
These are things that are planned for a 0.2 version:

* A Visual Studio 2013 project generator.
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

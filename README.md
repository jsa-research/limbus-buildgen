# limbus-buildgen
_A "build anywhere" C/C++ makefile/project generator._

[![appveyor build status](https://ci.appveyor.com/api/projects/status/seltnbq40v7fv4du/branch/master?svg=true)](https://ci.appveyor.com/project/redien/limbus-buildgen/branch/master) [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) [![Coverage Status](https://img.shields.io/coveralls/redien/limbus-buildgen.svg)](https://coveralls.io/r/redien/limbus-buildgen?branch=master) [![Dependencies](https://david-dm.org/redien/limbus-buildgen.svg)](https://david-dm.org/redien/limbus-buildgen) [![devDependencies](https://david-dm.org/redien/limbus-buildgen/dev-status.svg)](https://david-dm.org/redien/limbus-buildgen#info=devDependencies) [![Public Domain](http://img.shields.io/badge/public%20domain%3F-yes-blue.svg)](http://creativecommons.org/publicdomain/zero/1.0/) [![SemVer](http://img.shields.io/badge/SemVer-2.0.0-blue.svg)](http://semver.org/spec/v2.0.0.html) ![version](http://img.shields.io/badge/version-0.1.0-blue.svg) ![development stage](http://img.shields.io/badge/development%20stage-alpha-orange.svg)

limbus-buildgen builds small C/C++ code-bases that do not need a very complicated build process. Thus the generators can be kept small which makes them easy to test and port to other platforms.

The project consists of a set of Common.js modules written in pure ECMAScript which can be imported into your project. A CLI front-end is also available to generate build files without additional code.

## Compile
limbus-buildgen compiles using build files that it generated itself.

#### Linux/OS X/FreeBSD
Run `make` in the project root directory to build.

#### Windows
You will need to download some dependencies. If you have PowerShell 3.0 installed you can run the script `dependencies\fetch_dependencies.ps1` in the project root directory and it will download the required dependencies. Otherwise, you can download them manually, see [Download dependencies manually](#download-dependencies-manually).

When you have the dependencies, open "VS2013 x86 Native Tools Command Prompt" and run `nmake /f Makefile.mak` in the project root directory.

## Use
```
Usage: ./duk limbus-buildgen.js [flags] [path to JSON configuration file]

Options:

  --host <host>                   override the target host for the generated build files
  --buildFile <path>              specify the path and filename for the generated
                                  build file (default: ./Makefile)
```

## Configure
The JSON configuration files support the following properties: 
* **files** Specifies a list of source files
* **includePaths** Specifies where to find header files to include
* **host** Specifies the target host, i.e. the desired platform that the makefile should compile with
* **outputName** Specifies the name of the final executable
* **compilerFlags** Specifies any extra compiler flags that will be passed to the compiler as is

#### Example configuration file
```javascript
{
  "files": [
    "main.c"
  ],
  "includePaths": [
    "include/"
  ],
  "host": "darwin-clang",
  "outputName": "my-application",
  "compilerFlags": "-g -O0 -coverage"
}
```

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
  outputName: 'my-application',
  // Specifies any extra compiler flags that will be passed to the compiler as is
  compilerFlags: '-g -O0 -coverage'
});
```

## Test
limbus-buildgen performs testing using mocha and should.js.

To test, first install the required dependencies:
```
npm install -g mocha
npm install
```

Then run both unit- and integration tests using `npm test`

To run each separately, use `npm run-script unit-test` for unit tests and `npm run-script integration-test` for integration tests.

## Code coverage
limbus-buildgen analyzes code coverage using blanket.js.

To produce a report, run:
```
npm run-script coverage
```

This will generate a file named `coverage.html` in the project root directory which can be viewed in a browser.

## Support
The unit- & integration tests are automatically run against several combinations of target hosts, architectures and Node.js versions at every commit.

#### Target platforms
| Target Host   | Build Status | Built Configurations | Node.js Versions   |
| :------------ | :----------: | :------------------- | :----------------- |
| win32-cl | [![appveyor build status](https://ci.appveyor.com/api/projects/status/seltnbq40v7fv4du/branch/master?svg=true)](https://ci.appveyor.com/project/redien/limbus-buildgen/branch/master) | x86 Release, x64 Release | 0.10, 0.11 |
| linux-gcc | [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) | x64 | 0.10, 0.11 |
| linux-clang | | | |
| darwin-clang  | | | |
| freebsd-clang | | | |

## Download dependencies manually
limbus-buildgen uses Duktape as its Javascript interpreter. You can download Duktape 1.0.1 from `http://duktape.org/` and extract it into `dependencies/duktape-1.0.1`.

## Roadmap
Planned for a 0.2 version:
* A Visual Studio 2013 project generator.
* To be useful for building libraries, we need to be able to actually link as libraries.
* Linking to other libraries.
* Create release bundled with dependencies.

Towards a 1.0 release:
* Continous integration on all supported platforms.
* Provide an integrated executable for the front-end.
* Cross compilation to Android on supported platforms.
* A Xcode 6 project generator for iOS cross compilation.

## Copy
limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.

Written in 2014 by Jesper Oskarsson jesosk@gmail.com

To the extent possible under law, the author(s) have dedicated all copyright
and related and neighboring rights to this software to the public domain worldwide.
This software is distributed without any warranty.

You should have received a copy of the CC0 Public Domain Dedication along with this software.
If not, see <[http://creativecommons.org/publicdomain/zero/1.0/](http://creativecommons.org/publicdomain/zero/1.0/)>.

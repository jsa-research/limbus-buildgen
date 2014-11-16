# sea-strap.js
_A "build anywhere" C/C++ makefile/project generator._

[![appveyor build status](https://ci.appveyor.com/api/projects/status/seltnbq40v7fv4du/branch/master?svg=true)](https://ci.appveyor.com/project/redien/sea-strap-js/branch/master) [![travis-ci build status](https://travis-ci.org/redien/sea-strap.js.svg?branch=master)](https://travis-ci.org/redien/sea-strap.js) [![Coverage Status](https://img.shields.io/coveralls/redien/sea-strap.js.svg)](https://coveralls.io/r/redien/sea-strap.js?branch=master) [![Dependencies](https://david-dm.org/redien/sea-strap.js.svg)](https://david-dm.org/redien/sea-strap.js) [![devDependencies](https://david-dm.org/redien/sea-strap.js/dev-status.svg)](https://david-dm.org/redien/sea-strap.js#info=devDependencies) [![Public Domain](http://img.shields.io/badge/public%20domain%3F-yes-blue.svg)](http://creativecommons.org/publicdomain/zero/1.0/) [![SemVer](http://img.shields.io/badge/SemVer-2.0.0-blue.svg)](http://semver.org/spec/v2.0.0.html) ![version](http://img.shields.io/badge/version-0.1.0-blue.svg) ![development stage](http://img.shields.io/badge/development%20stage-alpha-orange.svg)

The goal of this project is to have a javascript library and companioning command-line application that can generate build files for a wide variety of platforms to build small and portable C/C++ code-bases. The aim is to keep the code-base small and as such features will be added only if there is a real need for something that would be used by most projects.

The library consists of a collection of Common.js modules that generate different types of build files. There is also a small command-line front-end that can be used to generate build files without writing additional code.

## Compile
sea-strap.js compiles using build files that it generated itself. The build process tries to follow the conventions of the platform.

#### Linux/OS X/FreeBSD
Run `make` in the project root directory to build.

#### Windows
You will need to download some dependencies. If you have PowerShell 3.0 installed you can run the script `dependencies\fetch_dependencies.ps1` in the project root directory and it will download the required dependencies. Otherwise, you can download them manually, see [Download dependencies manually](#download-dependencies-manually).

When you have the dependencies, open "VS2013 x86 Native Tools Command Prompt" and run `nmake /f Makefile.mak` in the project root directory.

## Use
To use, just run:
```
./duk sea-strap.js [flags] [path to JSON configuration file]
```

#### Flags
* **--host [host]** Overrides the target host for the generated build files.
* **--buildFile [path]** Specifies the path and filename for the generated build file. (defaults to `Makefile`)

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

## Support
The unit- & integration tests are automatically run against several combinations of target tuples, architectures and Node.js versions at every commit. The integration tests generate test build files using the compiled front-end, try to build them and then run the compiled executable and see if it returns the correct result.

#### Target platforms
| Target-Tuple  | Build Status | Built Configurations | Node.js versions   |
| :------------ | :----------: | :------------------- | :----------------- |
| win32-cl | [![appveyor build status](https://ci.appveyor.com/api/projects/status/seltnbq40v7fv4du/branch/master?svg=true)](https://ci.appveyor.com/project/redien/sea-strap-js/branch/master) | x86 Release, x64 Release | 0.10, 0.11 |
| linux-gcc | [![travis-ci build status](https://travis-ci.org/redien/sea-strap.js.svg?branch=master)](https://travis-ci.org/redien/sea-strap.js) | x64 | 0.10, 0.11 |
| linux-clang | | | |
| darwin-clang  | | | |
| freebsd-clang | | | |

## Download dependencies manually
sea-strap.js uses Duktape as its Javascript interpreter. You can download Duktape from `http://duktape.org/` and extract it into `dependencies/duktape-1.0.1`. Version 1.0.1 is currently used.

## Roadmap
These are things that are planned for a 0.2 version:
* A Visual Studio 2013 project generator.
* To be useful for building libraries, we need to be able to actually link as libraries.
* Linking to other libraries.
* Create release bundled with dependencies.

Towards a 1.0 release, these features are planned:
* Continous integration on all supported platforms.
* Provide an integrated executable for the front-end.
* Cross compilation to Android on supported platforms.
* A Xcode 6 project generator for iOS cross compilation.

## Copy
sea-strap.js - A "build anywhere" C/C++ makefile/project generator.

Written in 2014 by Jesper Oskarsson jesosk@gmail.com

To the extent possible under law, the author(s) have dedicated all copyright
and related and neighboring rights to this software to the public domain worldwide.
This software is distributed without any warranty.

You should have received a copy of the CC0 Public Domain Dedication along with this software.
If not, see <[http://creativecommons.org/publicdomain/zero/1.0/](http://creativecommons.org/publicdomain/zero/1.0/)>.

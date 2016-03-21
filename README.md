# limbus-buildgen
![version](http://img.shields.io/badge/version-0.2.0-blue.svg) [![Public Domain](http://img.shields.io/badge/public%20domain%3F-yes-blue.svg)](http://creativecommons.org/publicdomain/zero/1.0/) [![SemVer](http://img.shields.io/badge/SemVer-2.0.0-blue.svg)](http://semver.org/spec/v2.0.0.html) ![development stage](http://img.shields.io/badge/development%20stage-alpha-orange.svg)

limbus-buildgen generates build files for small C/C++ code-bases that do not need a very complicated build process. Thus this library can be kept small which makes it easy to test and port to other platforms.

The project consists of a set of Common.js modules written in ES5.1 which can be imported into your project. A CLI front-end is also available to generate build files without additional code.

## Use
```
Usage: ./duk limbus-buildgen.js [flags] <path to JSON configuration file>

Options:

  --help                          output usage information
  --host <host>                   override the configured target host
  --buildFile <path>              specify the path and filename for the
                                  generated build file (default: ./Makefile)

```

## Configure
The JSON configuration files support the following properties:

#### Required
* **type** Specifies the type of project to build, can be either "application", "dynamic-library" or "static-library".
* **files** Specifies a list of source files.
* **host** Specifies the target host, i.e. the desired OS & compiler that the makefile should compile with. *See the table below for valid identifiers.*
* **outputName** Specifies the name of the final executable.

#### Optional
* **outputPath** Specifies a path to prepend to the outputName. *It defaults to the current working directory.*
* **includePaths** Specifies where to find header files to include.
* **compilerFlags** Specifies any extra compiler flags that will be passed to the compiler as is.
* **linkerFlags** Specifies any extra linkers flags that will be passed to the compiler as is.
* **libraries** Specifies any libraries to link with when building an application or dynamic library.

#### Valid host identifiers
|Identifier|Target OS & compiler|
|:--|:--|
|linux|Linux & GCC|
|linux-clang|Linux & Clang|
|linux-gcc|Linux & GCC|
|darwin|Mac OS X & Clang|
|darwin-clang|Mac OS X & Clang|
|darwin-gcc|Mac OS X & GCC|
|win32|Windows & CL|
|win32-cl|Windows & CL|
|freebsd|FreeBSD & Clang|
|freebsd-clang|FreeBSD & Clang|
|freebsd-gcc|FreeBSD & GCC|

#### Example configuration file

```json
{
    "type": "application",
    "host": "darwin-clang",
    "files": [
        "main.c"
    ],
    "outputName": "my-application",

    "outputPath": "some/path",
    "includePaths": [
        "include/"
    ],
    "compilerFlags": "-g -O0 -coverage",
    "linkerFlags": "-coverage",
    "libraries": [
        "png"
    ]
}
```

## API
#### Generate Makefiles
```javascript
var makefile_generator = require('source/makefile-generator');

// Returns a string with the generated makefile.
var makefile = makefile_generator.generate({
    // The following options are required:
    // Specifies the type of project to build, can be either 'application', 'dynamic-library' or 'static-library'.
    type: 'application',
    // Specifies the target host, i.e. the desired OS & compiler that the makefile should compile with.
    host: 'darwin-clang',
    // Specifies a list of source files.
    files: [
        'main.c'
    ],
    // Specifies the name of the final executable.
    outputName: 'my-application',

    // The following options are optional:
    // Specifies a path to prepend to the outputName.
    outputPath: "some/path",
    // Specifies where to find header files to include.
    includePaths: [
        'include/'
    ],
    // Specifies any extra compiler flags that will be passed to the compiler as is.
    compilerFlags: '-g -O0 -coverage',
    // Specifies any extra linker flags that will be passed to the linker as is.
    linkerFlags: '-coverage',
    // Specifies any libraries to link with when building an application or dynamic library.
    libraries: [
        'png'
    ]
});
```

## Tested
Unit- & integration tests are automatically run against several combinations of target hosts, build configurations and Node.js versions at every push.

#### Integration matrix
| Target Host   | Build Status | Built Configurations | Node.js Versions   |
| :------------ | :----------: | :------------------- | :----------------- |
| linux-clang | [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) | x64 | 5.9.0, 4.4.0 |
| linux-gcc | [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) | x64 | 5.9.0, 4.4.0 |
| darwin-clang | [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) | x64 | 5.9.0, 4.4.0 |
| darwin-gcc | [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) | x64 | 5.9.0, 4.4.0 |
| win32-cl | [![appveyor build status](http://img.shields.io/appveyor/ci/redien/limbus-buildgen.svg)](https://ci.appveyor.com/project/redien/limbus-buildgen/branch/master) | x86 Release, x64 Release | 4.4.0 |
| freebsd-clang |||||

*FreeBSD is tested from time to time during development of new features but as there is currently no continuous integration on a FreeBSD host it should be considered less stable than the other target hosts.*

## Build
limbus-buildgen compiles using build files that it generated itself.

It has very few dependencies that it downloads automatically when built. However it is assumed that a standard C compiler is installed. (*For Windows users this means having Visual Studio installed. Most Unixes come with a C compiler suite.*)

#### Linux/OS X/FreeBSD
Run `make` in the project root directory to build.

#### Windows
You will need to download some dependencies. If you have PowerShell 3.0 installed you can run the script `dependencies\fetch_dependencies.ps1` in the project root directory and it will download the required dependencies. Otherwise, you can download them manually, see [Download dependencies manually](#download-dependencies-manually).

When you have the dependencies, open "VS2013 x86 Native Tools Command Prompt" and run `nmake /f Makefile.win32` in the project root directory.

#### Download dependencies manually
limbus-buildgen uses Duktape as its Javascript interpreter. You can download Duktape 1.4.0 from `http://duktape.org/` and extract it into `dependencies/duktape-1.4.0`.

## Development
[![Dependencies](https://david-dm.org/redien/limbus-buildgen.svg)](https://david-dm.org/redien/limbus-buildgen) [![devDependencies](https://david-dm.org/redien/limbus-buildgen/dev-status.svg)](https://david-dm.org/redien/limbus-buildgen#info=devDependencies)

For development you need some extra development dependencies.

```
npm install
```

#### Test
limbus-buildgen performs testing using mocha and should.js.

Run both unit- and integration tests using
```
npm test
```

To run each separately, use `npm run-script unit-test` for unit tests and `npm run-script integration-test` for integration tests.

#### Code coverage
[![Coverage Status](https://img.shields.io/coveralls/redien/limbus-buildgen.svg)](https://coveralls.io/r/redien/limbus-buildgen?branch=master)

limbus-buildgen analyzes code coverage using blanket.js. To produce a report, run:
```
npm run-script coverage
```

This will generate a file named `coverage.html` in the project root directory which can be viewed in a browser.

## Roadmap

#### Planned for a 0.5 version
* Provide an integrated executable for the front-end
* Provide npm packages for both executable and libraries
* Create release bundled with dependencies
* Override all configuration properties using flags
* Automate Windows dependency fetching
* Improve documentation

##### Towards a 1.0 release
* Continuous integration for all supported targets
* A Visual Studio project generator
* Cross compilation to iOS
* Cross compilation to Android
* Emscripten compiler support

##### Further into the future
* Cross compilation to Windows
* Modify makefile to find compilers and use whichever is available.

## Copy
limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.

Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com

To the extent possible under law, the author(s) have dedicated all copyright
and related and neighboring rights to this software to the public domain worldwide.
This software is distributed without any warranty.

You should have received a copy of the CC0 Public Domain Dedication along with this software.
If not, see <[http://creativecommons.org/publicdomain/zero/1.0/](http://creativecommons.org/publicdomain/zero/1.0/)>.

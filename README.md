# limbus-buildgen
![version](http://img.shields.io/badge/version-0.2.0-blue.svg) [![Public Domain](http://img.shields.io/badge/public%20domain%3F-yes-blue.svg)](http://creativecommons.org/publicdomain/zero/1.0/) [![SemVer](http://img.shields.io/badge/SemVer-2.0.0-blue.svg)](http://semver.org/spec/v2.0.0.html) ![development stage](http://img.shields.io/badge/development%20stage-alpha-orange.svg)

#### Introduction

limbus-buildgen generates build files for small C/C++ code-bases that do not need a very complicated build process. Thus this library can be kept small which makes it easy to test and port to other platforms.

The project consists of a set of Common.js modules written in ES5.1 which can be imported into your project. A CLI front-end is also available to generate build files without additional code.

#### Table of contents
* [Installation](#installation)
* [Using the CLI](#usage)
* [Configuration](#configuration)
* [Javascript API](#javascript-api)
* [Continuous Integration](#continuous-integration)
* [Building from source](#building-from-source)
* [Development](#development)
* [Roadmap](#roadmap)
* [Copyright](#copyright)

<a name="installation"></a>
## Installation

<a name="usage"></a>
## Using the CLI
```
Usage: limbus-buildgen [flags] <path to JSON configuration file>

Options:

  --help                          output usage information
  --host <host>                   override the configured target host
  --buildFile <path>              specify the path and filename for the
                                  generated build file (default: ./Makefile)

```

<a name="configuration"></a>
## Configuration
The JSON configuration files support the following properties:

#### Required

|Property|Description|
|:--:|:--|
|[type](#configuration-type)|Specifies the type of project to build.|
|[host](#configuration-host)|Specifies the target host, i.e. the desired OS & compiler that the makefile should compile with.|
|[input](#configuration-input)|Specifies a list of source files.|
|[outputName](#configuration-outputName)|Specifies the name of the final executable.|

#### Optional
|Property|Description|
|:--:|:--|
|[outputPath](#configuration-outputPath)|Specifies a path to prepend to the outputName. *It defaults to the build directory.*|
|[includePaths](#configuration-includePaths)|Specifies where to find header files to include.|
|[compilerFlags](#configuration-compilerFlags)|Specifies any extra compiler flags that will be passed to the compiler as is.|
|[linkerFlags](#configuration-linkerFlags)|Specifies any extra linkers flags that will be passed to the linker as is.|
|[libraries](#configuration-libraries)|Specifies any libraries to link with when building an application or dynamic library.|

#### Example configuration file
###### configuration.json
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
A makefile for the above example can be generated using:
```
limbus-buildgen configuration.json
```

#### Configuration Properties

<a name="configuration-type"></a>
###### type
There are three types of projects which can be generated:

|Type|Description|
|:--|:--|
|application|An executable application|
|static-library|A library that can be linked to at compile-time|
|dynamic-library|A library that can be linked to at run-time|

<a name="configuration-host"></a>
###### host
The following host identifiers can be used to target the corresponding operating system & compiler:

|Identifier|Target OS|Compiler|
|:--|:--|:--|
|linux|Linux|GNU GCC|
|linux-clang|Linux|Clang/LLVM|
|linux-gcc|Linux|GNU GCC|
|darwin|Mac OS X|Clang/LLVM|
|darwin-clang|Mac OS X|Clang/LLVM|
|darwin-gcc|Mac OS X|GNU GCC|
|win32|Windows|CL|
|win32-cl|Windows|CL|
|freebsd|FreeBSD|Clang/LLVM|
|freebsd-clang|FreeBSD|Clang/LLVM|
|freebsd-gcc|FreeBSD|GNU GCC|

<a name="configuration-input"></a>
###### input
The `input` property takes an array of strings. Each string contains a [path](#paths) to a input file relative to the build directory.

<a name="configuration-outputName"></a>
###### outputName
The property `outputName` takes a string with the name of the final executable or library. Depending on the compiler and type, the name given by `outputName` is prepended, appended or both to form a system specific file name.

Given a configuration with `"outputName": "file"` the following table shows the resulting file name:

|Compiler|Type|File name|
|:--|:--|:--|
|GNU GCC|application|file|
|GNU GCC|static-library|libfile.a|
|GNU GCC|dynamic-library|libfile.so|
|Clang|application|file|
|Clang|static-library|libfile.a|
|Clang|dynamic-library|libfile.so|
|CL|application|file.exe|
|CL|static-library|file.lib|
|CL|dynamic-library|file.dll|

The output name cannot be a [path](#paths).

<a name="configuration-outputPath"></a>
###### outputPath
The `outputPath` property takes a string with a [path](#paths) to be prepended to the [outputName](#outputName) to give the final location of the executable or library when built. The path can have a trailing [path separator](#paths) but does not require one.

<a name="configuration-includePaths"></a>
###### includePaths
The `includePaths` property takes an array of strings. Each string contains a [path](#paths) relative to the build directory to use to include header files.

<a name="configuration-compilerFlags"></a>
###### compilerFlags
Compiler flags are added to the compile command.

<a name="configuration-linkerFlags"></a>
###### linkerFlags
Linker flags are added to the link command. Which link command is used depends on the type and compiler specified. This needs to be taken into account when flags are added to the configuration.

The following table describes what commands are used and how flags are inserted for all compiler/type combinations:

|Compiler|Type|Command|
|:--|:--|:--|
|GNU GCC|application|gcc -o executable file.o [flags]|
|GNU GCC|static-library|ar rcs[flags] liblibrary.a file.o|
|GNU GCC|dynamic-library|gcc -shared -o liblibrary.so file.o [flags]|
|Clang|application|clang -o executable file.o [flags]|
|Clang|static-library|ar rcs[flags] liblibrary.a file.o|
|Clang|dynamic-library|clang -shared -o liblibrary.so file.o [flags]|
|CL|application|cl /Feexecutable.exe file.obj [flags]|
|CL|static-library|lib /OUT:library file.obj [flags]|
|CL|dynamic-library|link /DLL /OUT:library file.obj [flags]|

<a name="configuration-libraries"></a>
###### libraries
The `libraries` property takes an array of strings. Each string contains a [path](#paths) to a library file to link to.

<a name="paths"></a>
#### Paths
All paths in the configuration are given as POSIX paths. The generators take care of adapting the paths to the final build operating system.

`.` specifies the current directory.
`..` specifies the parent directory of the current one.
`/` separates each directory with the last part giving the target file or directory of the path.

<a name="javascript-api"></a>
## Javascript API
#### Generate Makefiles
```javascript
var makefile_generator = require('../source/makefile-generator');

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

<a name="continuous-integration"></a>
## Continuous Integration
Unit- & integration tests are automatically run against several combinations of target hosts, build configurations and Node.js versions at every push.

#### Integration matrix
| Target Host   | Build Status | Built Configurations | Node.js Versions   |
| :------------ | :----------: | :------------------- | :----------------- |
| linux-clang | [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) | x64 | 5.9.0, 4.4.0 |
| linux-gcc | [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) | x64 | 5.9.0, 4.4.0 |
| darwin-clang | [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) | x64 | 5.9.0, 4.4.0 |
| darwin-gcc | [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) | x64 | 5.9.0, 4.4.0 |
| win32-cl | [![appveyor build status](http://img.shields.io/appveyor/ci/redien/limbus-buildgen.svg)](https://ci.appveyor.com/project/redien/limbus-buildgen/branch/master) | x86 Release, x64 Release | 4.4.0 |
| freebsd-clang ||||
| freebsd-gcc |||||

*FreeBSD is tested from time to time during development of new features but as there is currently no continuous integration on a FreeBSD host it should be considered less stable than the other target hosts.*

<a name="building-from-source"></a>
## Building from source
For all platforms, open a terminal and run the following command in the root project directory:
```
make
```

limbus-buildgen compiles using build files that it generated itself. To re-generate the makefiles run `utility-scripts/generate_build_files.sh` on a Unix-like OS after building.

#### Dependencies

There are very few dependencies and they are downloaded automatically when built. However it is assumed that a standard C compiler is installed. (*For Windows users this means having Visual Studio or the Windows SDK installed in their default installation directory. Most Unixes come with a C compiler suite.*)

*Windows users will need PowerShell 3.0+ installed (which comes with Windows 7 SP1 or later) to automatically download the dependencies. If this is not possible, see [Download dependencies manually](#build-download-dependencies-manually)*

<a name="build-download-dependencies-manually"></a>
#### Download dependencies manually
Duktape is used for Javascript execution. You can download the Duktape 1.4.0 release package from `http://duktape.org/` and extract it into `dependencies/duktape-1.4.0`.

<a name="development"></a>
## Development
[![Dependencies](https://david-dm.org/redien/limbus-buildgen.svg)](https://david-dm.org/redien/limbus-buildgen) [![devDependencies](https://david-dm.org/redien/limbus-buildgen/dev-status.svg)](https://david-dm.org/redien/limbus-buildgen#info=devDependencies)

For development you need some extra development dependencies. Install them using NPM with:

```
npm install
```

#### Test
limbus-buildgen performs testing using mocha and should.js.

Run both unit- and integration tests using
```
npm test
```

To run each separately, use `npm run unit-test` for unit tests and `npm run integration-test` for integration tests.

#### Code coverage
[![Coverage Status](https://img.shields.io/coveralls/redien/limbus-buildgen.svg)](https://coveralls.io/r/redien/limbus-buildgen?branch=master)

limbus-buildgen analyzes code coverage using blanket.js. To produce a report, run:
```
npm run-script coverage
```

This will generate a file named `coverage.html` in the project root directory which can be viewed in a browser.

<a name="roadmap"></a>
## Roadmap

#### Planned for a 0.5 version
This release is intended to streamline the user experience and produce a done release that is not fully feature-complete. It will take the project from an alpha phase into beta.

* Provide an integrated executable for the front-end
* Provide npm packages for both executable and libraries
* Create release bundled with dependencies
* Override all configuration properties using flags
* Complete documentation
* Modify makefile generator so that makefiles make use of make's "implicit variables"
* Library include paths
* Provide configuration overrides for when different arguments are passed

##### Planned for a 0.6 release
This release will implement cross compilation to mobile devices.

* Cross compilation to iOS
* Cross compilation to Android

##### Planned for a 0.7 release
This release will implement cross compilation to web browsers through Emscripten.

* Emscripten compiler support

##### Planned for a 0.8 release
This release will implement the rest of the features to make it feature-complete.

* A Visual Studio project generator

##### Towards a 1.0 release
This release will stabilize the project to make it ready for production.

* Continuous integration for all supported targets

##### Further into the future
Features which aren't needed for feature-completeness but are nice to have.

* Cross compilation to Windows using MinGW
* Modify makefile to find compilers and use whichever is available.
* Support for more compiler suites:
    - AMD's Open64
    - Intel's C++ compiler
    - MinGW
    - Solaris Studio
* Support for more build systems:
    - Ninja
    - Code::Blocks
    - JetBrain's CLion
    - NetBeans C++

<a name="copyright"></a>
## Copyright
limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.

Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com

To the extent possible under law, the author(s) have dedicated all copyright
and related and neighboring rights to this software to the public domain worldwide.
This software is distributed without any warranty.

You should have received a copy of the CC0 Public Domain Dedication along with this software.
If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

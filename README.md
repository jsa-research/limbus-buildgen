# limbus-buildgen
![version](http://img.shields.io/badge/version-0.2.0-blue.svg) [![Public Domain](http://img.shields.io/badge/public%20domain%3F-yes-blue.svg)](http://creativecommons.org/publicdomain/zero/1.0/) [![SemVer](http://img.shields.io/badge/SemVer-2.0.0-blue.svg)](http://semver.org/spec/v2.0.0.html) ![development stage](http://img.shields.io/badge/development%20stage-alpha-orange.svg)

#### Introduction

limbus-buildgen is a C/C++/Objective-C meta-build system written in Javascript. It generates project files and makefiles from portable JSON configuration files.

###### Flashy features
* Developers building your project only require their compiler
* limbus-buildgen can be installed on pretty much any operating system
* Comes with a Common.js Javascript API to support scripting

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
limbus-buildgen is distributed with a range of different package managers to make installation simple on as many systems as possible.

#### NPM
```
npm install -g limbus-buildgen
```

#### Homebrew
```
brew install https://raw.githubusercontent.com/redien/limbus-buildgen/master/limbus-buildgen.rb
```

#### Git
```
git clone https://github.com/redien/limbus-buildgen.git && cd limbus-buildgen && make
```

#### Manually download ZIP
You can also download the ZIP from https://github.com/redien/limbus-buildgen/archive/master.zip and [build manually from source](#building-from-source).

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

#### Example configuration file
The following configuration file specifies a makefile that compiles an executable on OS X using LLVM Clang, links to libpng and outputs debug and coverage information.

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
    "libraryPaths": [
        "build/"
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

The JSON configuration files support the following properties:

###### Required

|Property|Description|
|:--:|:--|
|[type](#configuration-type)|Specifies the type of project to build.|
|[host](#configuration-host)|Specifies the target host, i.e. the desired OS & compiler that the makefile should compile with.|
|[files](#configuration-files)|Specifies a list of source files.|
|[outputName](#configuration-outputName)|Specifies the name of the final executable.|

###### Optional
|Property|Description|
|:--:|:--|
|[outputPath](#configuration-outputPath)|Specifies a path to prepend to the outputName. *It defaults to the build directory.*|
|[includePaths](#configuration-includePaths)|Specifies where to find header files to include.|
|[libraryPaths](#configuration-libraryPaths)|Specifies where to find libraries to link.|
|[compilerFlags](#configuration-compilerFlags)|Specifies any extra compiler flags that will be passed to the compiler as is.|
|[linkerFlags](#configuration-linkerFlags)|Specifies any extra linkers flags that will be passed to the linker as is.|
|[libraries](#configuration-libraries)|Specifies any libraries to link with when building an application or dynamic library.|

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

<a name="configuration-files"></a>
###### files
The `files` property takes an array of strings. Each string contains a [path](#paths) to an input file relative to the build directory.

<a name="configuration-outputName"></a>
###### outputName
The property `outputName` takes a string with the name of the final executable or library. Depending on the compiler and type, the name given by `outputName` is prepended, appended or both to form a file name according to the host's naming standard.

Given a configuration file with `"outputName": "file"` the following table shows the resulting file name:

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

<a name="configuration-libraryPaths"></a>
###### libraryPaths
The `libraryPaths` property takes an array of strings. Each string contains a [path](#paths) relative to the build directory to use to search for libraries to link.

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
|CL|application|cl /Feexecutable.exe file.obj /link [flags]|
|CL|static-library|lib /OUT:library file.obj [flags]|
|CL|dynamic-library|cl /LD /Felibrary file.obj /link [flags]|

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
var fs = require('fs');
var buildgen = require('limbus-buildgen');

// The following example generates a makefile from a project
// name and a configuration object.
var files = buildgen.generate('Project name', [{
    // The following properties are required:
    // ----------------------------------
    // Specifies the type of project to build, can be either
    // 'application', 'dynamic-library' or 'static-library'.
    type: 'application',
    // Specifies the target host, i.e. the desired OS &
    // compiler that the makefile should compile with.
    host: 'darwin-clang',
    // Specifies a list of source files.
    files: [
        'main.c'
    ],
    // Specifies the name of the final executable.
    outputName: 'my-application',

    // The following properties are optional:
    // ----------------------------------
    // Specifies a path to prepend to the outputName.
    outputPath: "some/path",
    // Specifies where to find header files to include.
    includePaths: [
        'include/'
    ],
    // Specifies where to find libraries to link.
    libraryPaths: [
        'build/'
    ],
    // Specifies any extra compiler flags that will be passed
    // to the compiler as is.
    compilerFlags: '-g -O0 -coverage',
    // Specifies any extra linker flags that will be passed to
    // the linker as is.
    linkerFlags: '-coverage',
    // Specifies any libraries to link with when building an
    // application or dynamic library.
    libraries: [
        'png'
    ]
}]);

// Directories are created and generated files are written to
// them according to the targeted build system.
for (var path in files) {
    var file = files[path];

    if (file.isDirectory) {
        fs.mkdir(path);
    } else if (file.isFile) {
        fs.writeFileSync(path, file.contents);
    }
}
```

<a name="continuous-integration"></a>
## Continuous Integration
Unit- & integration tests are automatically run against several combinations of target hosts, build configurations and Node.js versions at every push.

#### Integration matrix
| Target Host   | Build Status | Built Configurations | Node.js Versions   |
| :------------ | :----------: | :------------------- | :----------------- |
| linux-clang | [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) | x64 | 5.9.x, 4.4.x |
| linux-gcc | [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) | x64 | 5.9.x, 4.4.x |
| darwin-clang | [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) | x64 | 5.9.x, 4.4.x |
| darwin-gcc ||||
| win32-cl | [![appveyor build status](http://img.shields.io/appveyor/ci/redien/limbus-buildgen.svg)](https://ci.appveyor.com/project/redien/limbus-buildgen/branch/master) | x64 Release | 4.4.x |
| freebsd-clang | [![FreeBSD CI status](https://jesperoskarsson.se/limbus-buildgen-ci/node-clang/badge.svg)](https://jesperoskarsson.se/limbus-buildgen-ci/node-clang/ci-log.txt) | x64 | 5.10.x |
| freebsd-gcc | [![FreeBSD CI status](https://jesperoskarsson.se/limbus-buildgen-ci/node-gcc/badge.svg)](https://jesperoskarsson.se/limbus-buildgen-ci/node-gcc/ci-log.txt) | x64 | 5.10.x |

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

#### Planned for 0.5.0-beta
This release is intended to streamline the user experience, stabilize the Javascript API and produce a done release that is not fully feature-complete. It will take the project from an alpha phase into beta.

* Provide future proofed Javascript API
* Modify makefile generator so that makefiles make use of make's "implicit variables" to allow changing them through environment variables
* Standardize on a `host` property that can support build hosts, compilers, target hosts and architectures
* Add configuration property to add/remove debug information during compilation
* Change shared library suffix to .dylib on darwin to reflect the actual library type generated
* Remove `/link` from CL linker commands and make user add it themselves to give more flexibility in which flags can be set

##### Towards 0.9.0-beta
This release will complete the continuous integration setup to make sure all features are tested properly.

* Make sure GCC is tested against on OS X when running on CI
* Compile against x86 on CI builds
* Make CI scripts build the executable against the correct compiler and architecture
* Continuous integration for all supported targets
* Convert integration tests to acceptance tests using Gherkin syntax
* Look into installing node and npm versions through npm itself

##### Towards 1.0.0
This release will implement the rest of the features to reach feature completeness.

* Add sub-configurations that override properties when activated through command line options
* Override all configuration properties using flags
* Autoconf & Automake support
* A Visual Studio project generator
* Enable compilation of both shared libraries and dynamically loaded modules on darwin. (See http://stackoverflow.com/a/2339910/3636255)
* Create release bundled with dependencies
* Release on Homebrew

##### Planned for 1.1.0
This release will implement cross compilation to mobile devices.

* Implement cross compilation support for iOS with host `darwin-ndk-ios`
* Implement cross compilation support for Android with hosts `linux-ndk-android`, `darwin-ndk-android` and `win32-ndk-android`
* Add architectures as appropriate

##### Planned for 1.2.0
This release will implement cross compilation to web browsers through Emscripten.

* Implement cross compilation support for asm.js with hosts `linux-emcc-asmjs`, `darwin-emcc-asmjs` and `win32-emcc-asmjs`

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

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
  --toolchain <toolchain>         override the configured target toolchain
  --outputPath <path>             specify the path where build files are written
                                  to (default: .)

```

<a name="configuration"></a>
## Configuration

#### Example configuration file
The following configuration file specifies a makefile that compiles an executable called `executable_name` on OS X using LLVM Clang, links to libpng and outputs debug and coverage information.

###### configuration.json
```json
{
    "title": "Project title",
    "toolchain": "darwin-make-clang-darwin-x64",
    "artifacts": [{
        "title": "Main executable",
        "type": "application",
        "files": [
            "main.c"
        ],
        "outputName": "executable_name",

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
    }]
}
```
A makefile for the above example can be generated using:
```
limbus-buildgen configuration.json
```

#### Project Properties
The project configuration dictionary supports the following properties:

###### Required
|Property|Description|
|:--:|:--|
|[title](#configuration-project-title)|Specifies a title identifying the project.|
|[toolchain](#configuration-project-toolchain)|Specifies the target toolchain, i.e. the desired OS & compiler that the makefile should compile with.|
|[artifacts](#configuration-project-artifacts)|Specifies a list of artifacts to build.|

<a name="configuration-project-title"></a>
###### title
An arbitrary string identifying the project. It is only used for naming the build files and does not affect the final executable or library built.

<a name="configuration-project-toolchain"></a>
###### toolchain
The `toolchain` property is used to specify how the makefile will be built and for which platforms.

|Identifier|Build OS|Build System|Compiler|Target OS|Target Architecture|
|:--|:--|:--|:--|:--|:--|
|linux|Linux|make|GNU GCC|Linux|IA-32|
|linux-make-clang-linux-x86|Linux|make|LLVM Clang|Linux|IA-32|
|linux-make-clang-linux-x64|Linux|make|LLVM Clang|Linux|AMD64|
|linux-make-gcc-linux-x86|Linux|make|GNU GCC|Linux|IA-32|
|linux-make-gcc-linux-x64|Linux|make|GNU GCC|Linux|AMD64|
|darwin|Mac OS X|make|LLVM Clang|Mac OS X|IA-32|
|darwin-make-clang-darwin-x86|Mac OS X|make|LLVM Clang|Mac OS X|IA-32|
|darwin-make-clang-darwin-x64|Mac OS X|make|LLVM Clang|Mac OS X|AMD64|
|darwin-make-gcc-darwin-x86|Mac OS X|make|GNU GCC|Mac OS X|IA-32|
|darwin-make-gcc-darwin-x64|Mac OS X|make|GNU GCC|Mac OS X|AMD64|
|win32|Windows|nmake|Microsoft CL|Windows|IA-32|
|win32-make-cl-win32-x86|Windows|nmake|Microsoft CL|Windows|IA-32|
|win32-make-cl-win32-x64|Windows|nmake|Microsoft CL|Windows|AMD64|
|freebsd|FreeBSD|make|LLVM Clang|FreeBSD|IA-32|
|freebsd-make-clang-freebsd-x86|FreeBSD|make|LLVM Clang|FreeBSD|IA-32|
|freebsd-make-clang-freebsd-x64|FreeBSD|make|LLVM Clang|FreeBSD|AMD64|
|freebsd-make-gcc-freebsd-x64|FreeBSD|make|GNU GCC|FreeBSD|AMD64|

So for example, if you wanted to generate a makefile that builds on Mac OS X using the LLVM Clang compiler and also target Mac OS X on the IA-32 architecture you could use `darwin-make-clang-darwin-x86`. Or you could use `darwin` as these are the default settings.

<a name="configuration-project-artifacts"></a>
###### artifacts
A list of artifact configuration dictionaries. The artifacts will be built in the order they appear in the list.

#### Artifact Properties
The artifact configuration dictionaries support the following properties:

###### Required
|Property|Description|
|:--:|:--|
|[title](#configuration-title)|Specifies a title identifying the built artifact.|
|[type](#configuration-type)|Specifies the type of artifact to build.|
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

<a name="configuration-title"></a>
###### title
An arbitrary string identifying the artifact to build. It is only used for naming the build files and does not affect the final executable or library built.

<a name="configuration-type"></a>
###### type
There are three types of artifacts which can be built:

|Type|Description|
|:--|:--|
|application|An executable application|
|static-library|A library that can be linked to at compile-time|
|dynamic-library|A library that can be linked to at run-time|

<a name="configuration-files"></a>
###### files
The `files` property takes an array of strings. Each string contains a [path](#paths) to an input file relative to the build directory.

<a name="configuration-outputName"></a>
###### outputName
The property `outputName` takes a string with the name of the final executable or library. Depending on the compiler and type, the name given by `outputName` is prepended, appended or both to form a file name according to the toolchain's naming standard.

Given a configuration file with `"outputName": "file"` the following table shows the resulting file name:

|Compiler|Type|File name|
|:--|:--|:--|
|GNU GCC|application|file|
|GNU GCC|static-library|libfile.a|
|GNU GCC|dynamic-library|libfile.so|
|LLVM Clang|application|file|
|LLVM Clang|static-library|libfile.a|
|LLVM Clang|dynamic-library|libfile.so|
|Microsoft CL|application|file.exe|
|Microsoft CL|static-library|file.lib|
|Microsoft CL|dynamic-library|file.dll|

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
|LLVM Clang|application|clang -o executable file.o [flags]|
|LLVM Clang|static-library|ar rcs[flags] liblibrary.a file.o|
|LLVM Clang|dynamic-library|clang -shared -o liblibrary.so file.o [flags]|
|Microsoft CL|application|cl /Feexecutable.exe file.obj /link [flags]|
|Microsoft CL|static-library|lib /OUT:library file.obj [flags]|
|Microsoft CL|dynamic-library|cl /LD /Felibrary file.obj /link [flags]|

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
// title and an artifact configuration.
var files = buildgen.generate({
    title: 'Project title',
    toolchain: 'darwin-make-clang-darwin-x64',
    artifacts: [{
        title: 'Main executable',
        type: 'application',
        files: [
            'main.c'
        ],
        outputName: 'executable_name',

        outputPath: "some/path",
        includePaths: [
            'include/'
        ],
        libraryPaths: [
            'build/'
        ],
        compilerFlags: '-g -O0 -coverage',
        linkerFlags: '-coverage',
        libraries: [
            'png'
        ]
    }]
});

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
Unit- & integration tests are automatically run against several combinations of target toolchains, build configurations and Node.js versions at every push.

#### Integration matrix
| Target Toolchain   | Build Status |  Node.js Versions   |
| :------------ | :----------: |  :----------------- |
| linux-make-clang-linux-x86 | [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) | 5.9.x |
| linux-make-clang-linux-x64 | [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) | 5.9.x |
| linux-make-gcc-linux-x86 | [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) | 5.9.x |
| linux-make-gcc-linux-x64 | [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) | 5.9.x |
| darwin-make-clang-darwin-x86 | [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) | 5.9.x |
| darwin-make-clang-darwin-x64 | [![travis-ci build status](https://travis-ci.org/redien/limbus-buildgen.svg?branch=master)](https://travis-ci.org/redien/limbus-buildgen) | 5.9.x |
| darwin-make-gcc-darwin-x86 |||
| darwin-make-gcc-darwin-x64 |||
| win32-make-cl-win32-x86 | [![appveyor build status](http://img.shields.io/appveyor/ci/redien/limbus-buildgen.svg)](https://ci.appveyor.com/project/redien/limbus-buildgen/branch/master) | 4.4.x |
| win32-make-cl-win32-x64 | [![appveyor build status](http://img.shields.io/appveyor/ci/redien/limbus-buildgen.svg)](https://ci.appveyor.com/project/redien/limbus-buildgen/branch/master) | 4.4.x |
| freebsd-make-clang-freebsd-x86 | [![FreeBSD CI status](https://jesperoskarsson.se/limbus-buildgen-ci/clang-x86/badge.svg)](https://jesperoskarsson.se/limbus-buildgen-ci/clang-x86/ci-log.txt) | 5.10.x |
| freebsd-make-clang-freebsd-x64 | [![FreeBSD CI status](https://jesperoskarsson.se/limbus-buildgen-ci/clang-x64/badge.svg)](https://jesperoskarsson.se/limbus-buildgen-ci/clang-x64/ci-log.txt) | 5.10.x |
| freebsd-make-gcc-freebsd-x64 | [![FreeBSD CI status](https://jesperoskarsson.se/limbus-buildgen-ci/gcc-x64/badge.svg)](https://jesperoskarsson.se/limbus-buildgen-ci/gcc-x64/ci-log.txt) | 5.10.x |

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

* Add configuration property to add/remove debug information during compilation
* Change toolchain property to toolchains and allow entering several toolchains
* Add toolchains with default architecture
* Change shared library suffix to .dylib on darwin to reflect the actual library type generated
* Remove `/link` from CL linker commands and make user add it themselves to give more flexibility in which flags can be set
* Make sure C++/Objective-C files compile correctly

##### Towards 0.6.0-beta
This release will complete the continuous integration setup to make sure all features are tested properly.

* Make sure GCC is tested against on OS X when running on CI
* Make CI scripts build the executable against the correct compiler and architecture
* Continuous integration for all supported targets
* Convert integration tests to acceptance tests using Gherkin syntax
* Look into installing node and npm versions through npm itself
* Replace Blanket.js as it is no longer maintained.

##### Towards 1.0.0
This release will implement the rest of the features to reach feature completeness.

* Add post- and pre-build shell commands to artifacts
* Add sub-configurations that override properties when activated through command line options
* Override all configuration properties using flags
* Autoconf & Automake support
* A Visual Studio project generator
* Enable compilation of both shared libraries and dynamically loaded modules on darwin. (See http://stackoverflow.com/a/2339910/3636255)
* Create release bundled with dependencies
* Release on Homebrew
* Release on Chocolatey

##### Planned for 1.1.0
This release will implement cross compilation to mobile devices.

* Implement cross compilation support for iOS with toolchain `darwin-xcode-clang-ios-all`
* Implement cross compilation support for Android with toolchains `linux-ndkbuild-ndk-android-all`, `darwin-ndkbuild-ndk-android-all` and `win32-ndkbuild-ndk-android-all`
* Add architectures as appropriate

##### Planned for 1.2.0
This release will implement cross compilation to web browsers through Emscripten.

* Implement cross compilation support for asm.js with toolchains `linux-make-emcc-asmjs`, `darwin-make-emcc-asmjs` and `win32-make-emcc-asmjs`

##### Further into the future
Features which aren't needed for feature-completeness but are nice to have.

* Cross compilation to Windows using MinGW
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

# sea-strap.js
_A "build anywhere" C/C++ makefile/project generator._

The goal of the project is to have a javascript library and companioning command-line application
that can generate build files for a wide variety of platforms to build small and portable
C/C++ code-bases.

*Currently bootstrapping itself and as such is not very useful...*

## Dependencies
sea-strap.js depends on some other open source projects to build.

#### Linux/OS X/FreeBSD
_Dependencies are fetched automatically before building so no manual install is neccessary._

#### Windows
See [Download dependencies manually](#download-dependencies-manually)

#### Download dependencies manually
Download and extract Duktape from `http://duktape.org/` and extract into `dependencies/duktape-1.0.0`.
Version 1.0.0 is currently used.

## Compile
sea-strap.js compiles using build files that it generated itself. The build process tries to follow the conventions of the platform.

#### Linux/OS X/FreeBSD
Run `make` in the root folder to build the project.

#### Windows
TODO

## Use
To use, just run:
```
./duk sea-strap.js freebsd > Makefile.freebsd
./duk sea-strap.js linux > Makefile.linux
./duk sea-strap.js darwin > Makefile.darwin
```

(_Note: At the moment this only builds bootstrap makefiles for itself. Not very useful..._)

## Test
As sea-strap.js uses mocha and should.js to perform testing,
first make sure they are installed with:
```
npm install -g mocha
npm install
```

Then run both unit- and integration tests using `npm test`

To run each separately, use `npm run-script unit-test`for unit tests and `npm run-script integration-test` for integration tests.

## Roadmap
These are things that are planned for a 0.2 version:

* A Visual Studio 2013 project generator.
* Cross compilation to Android and iOS on supported platforms.

## Copy
sea-strap.js - A "build anywhere" C/C++ makefile/project generator.

Written in 2014 by Jesper Oskarsson jesosk@gmail.com

To the extent possible under law, the author(s) have dedicated all copyright
and related and neighboring rights to this software to the public domain worldwide.
This software is distributed without any warranty.

You should have received a copy of the CC0 Public Domain Dedication along with this software.
If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

# sea-strap.js
_A "build anywhere" C/C++ makefile/project generator._

The goal of the project is to have a javascript library and companioning command-line application
that can generate build files for a wide variety of platforms to build small and portable
C/C++ code-bases.

*Currently bootstrapping itself and as such is not very useful...*

## Dependencies
The following commands will install some dependencies from npm:

```
npm install -g grunt-cli
npm install
```

You also need to fetch some additional non-npm dependencies:

#### Linux/OS X
Fetch non-npm dependencies using `dependencies/fetch_dependencies.sh`

#### Windows
See [Download dependencies manually](#download-dependencies-manually)

#### Download dependencies manually
Download and extract Duktape from `http://duktape.org/` and extract into `dependencies/duktape-1.0.0`.
Currently version 1.0.0 is used.

## Compile
Grunt is currently just used to boostrap the library as duktape
doesn't provide file I/O.

#### Linux/OS X
Use `make ; grunt` to build the project.

#### Windows
TODO

## Use
To use, just run:
```
./duk sea-strap.js > Makefile
```

(_Note: At the moment this only builds a bootstrap makefile for itself. Not very useful..._)

## Test
As sea-strap.js uses mocha to perform unit-testing,
first make sure it is installed with `npm install -g mocha`

Then run both unit- and integration tests using `npm test`

To run each separately, use `mocha unit`for unit tests and `mocha integration` for integration tests.

## Copy
sea-strap.js - A "build anywhere" C/C++ makefile/project generator.

Written in 2014 by Jesper Oskarsson jesosk@gmail.com

To the extent possible under law, the author(s) have dedicated all copyright
and related and neighboring rights to this software to the public domain worldwide.
This software is distributed without any warranty.

You should have received a copy of the CC0 Public Domain Dedication along with this software.
If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

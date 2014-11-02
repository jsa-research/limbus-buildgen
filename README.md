# sea-strap.js
_A "build anywhere" C/C++ makefile/project generator._

The goal of the project is to have a javascript library and companioning command-line application
that can generate build files for a wide variety of platforms to build small and portable
C/C++ code-bases.

*Currently bootstrapping itself and as such is not very useful...*

## Compile
sea-strap.js uses mocha & should.js to perform unit-testing.
Grunt is currently just used to boostrap the library as duktype
doesn't provide file I/O.

The following commands will install all dependencies and build the necessary files.
```
npm install -g grunt-cli
npm install
```

## Use

To use, just run:
```
./duk sea-strap.js > Makefile
```

(*Note:* At the moment this only builds a bootstrap makefile for itself. Not very useful...)

## Test
As sea-strap.js uses Mocha as its test runner, first make sure it is installed with `npm install -g mocha`

Then run the tests using `mocha`

## Copyright
sea-strap.js - A "build anywhere" C/C++ makefile/project generator.
Written in 2014 by Jesper Oskarsson jesosk@gmail.com

To the extent possible under law, the author(s) have dedicated all copyright
and related and neighboring rights to this software to the public domain worldwide.
This software is distributed without any warranty.

You should have received a copy of the CC0 Public Domain Dedication along with this software.
If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

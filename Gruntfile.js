
// sea-strap.js - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                stripBanners: {
                    line: true,
                    block: true
                }
            },
            'modules': {
                options: {
                    banner: "// This file is generated. Do not edit directly!\nDuktape.modSearch = function (id) {\n",
                    process: function (source, filepath) {
                        return '  if (id === "' + filepath.replace('.js', '') + '") {\n' +
                               '    return "' + source.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, '\\n') + '";\n' +
                               '  }\n';
                    },
                    footer: "  throw new Error('module not found: ' + id);\n};\n"
                },
                src: [
                    'source/*-generator.js'
                ],
                dest: 'modules.js'
            },
            'final-build': {
                options: {
                    banner: "// This file is generated. Do not edit directly!\n"
                },
                src: [
                    'modules.js',
                    'source/sea-strap.js'
                ],
                dest: 'sea-strap.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['concat']);
};
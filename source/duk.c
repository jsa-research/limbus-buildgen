
/*
 * sea-strap.js - A "build anywhere" C/C++ makefile/project generator.
 * Written in 2014 by Jesper Oskarsson jesosk@gmail.com
 *
 * To the extent possible under law, the author(s) have dedicated all copyright
 * and related and neighboring rights to this software to the public domain worldwide.
 * This software is distributed without any warranty.
 *
 * You should have received a copy of the CC0 Public Domain Dedication along with this software.
 * If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */

#include <stdlib.h>
#include <duktape.h>
#include "platform.h"

char** arguments;
int argument_count;

static int get_stack_trace(duk_context* context) {
    if (duk_is_object(context, -1) && duk_has_prop_string(context, -1, "stack")) {
        duk_get_prop_string(context, -1, "stack");
        duk_remove(context, -2);
    }
    return 1;
}

static int compile_and_execute(duk_context* context) {
    duk_compile(context, 0);
    duk_push_global_object(context);
    
    duk_push_array(context);
    for (int i = 0; i < argument_count; ++i) {
        duk_push_string(context, arguments[i]);
        duk_put_prop_index(context, -2, i);
    }
    duk_put_prop_string(context, -2, "arguments");

    duk_call_method(context, 0);
    duk_pop(context);
    return 0;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        fprintf(stderr, "No input file\n");
        return -1;
    }
    
    void* source = sea_platform_read_file(argv[1]);
    if (sea_platform_buffer_is_valid(source)) {
        duk_context* context = duk_create_heap_default();
        duk_push_lstring(context,
                         sea_platform_buffer_data_as_c_pointer(source),
                         sea_platform_buffer_size(source));
        duk_push_string(context, argv[1]);
        sea_platform_buffer_destruct(source);
        
        arguments = argv;
        argument_count = argc;

        int status = duk_safe_call(context, compile_and_execute, 2, 1);
        if (status != DUK_EXEC_SUCCESS) {
            (void)duk_safe_call(context, get_stack_trace, 1, 1);
            fprintf(stderr, "%s\n", duk_safe_to_string(context, -1));
        } else {
            duk_pop(context);
        }

        duk_destroy_heap(context);
    }

    return 0;
}


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

static int duk_process_exit(duk_context* context) {
    int exitCode = duk_require_number(context, 0);
    exit(exitCode);
    return 0;
}

static int compile_and_execute(duk_context* context) {
    int i;
    duk_compile(context, 0);
    duk_push_global_object(context);
    duk_push_object(context);
    duk_push_array(context);
    for (i = 0; i < argument_count; ++i) {
        duk_push_string(context, arguments[i]);
        duk_put_prop_index(context, -2, i);
    }
    duk_put_prop_string(context, -2, "argv");

    duk_push_c_function(context, duk_process_exit, 1);
    duk_put_prop_string(context, -2, "exit");
    
    duk_put_prop_string(context, -2, "process");

    duk_call_method(context, 0);
    duk_pop(context);
    return 0;
}

static int duk_sea_platform_buffer_construct(duk_context* context) {
    duk_double_t size = duk_require_number(context, 0);
    
    void* buffer = sea_platform_buffer_construct((unsigned long)size);
    duk_push_pointer(context, buffer);
    return 1;
}
static int duk_sea_platform_buffer_construct_with_buffer(duk_context* context) {
    void* data = duk_require_pointer(context, 0);
    duk_double_t size = duk_require_number(context, 1);

    void* buffer = sea_platform_buffer_construct_with_buffer(data, (unsigned long)size);
    duk_push_pointer(context, buffer);
    return 1;
}
static int duk_sea_platform_buffer_construct_with_string(duk_context* context) {
    duk_size_t size;
    const char* data = duk_require_lstring(context, 0, &size);

    void* buffer = sea_platform_buffer_construct_with_buffer((void*)data, size);
    duk_push_pointer(context, buffer);
    return 1;
}
static int duk_sea_platform_buffer_destruct(duk_context* context) {
    void* buffer = duk_require_pointer(context, 0);

    sea_platform_buffer_destruct(buffer);
    return 0;
}
static int duk_sea_platform_buffer_is_valid(duk_context* context) {
    void* buffer = duk_require_pointer(context, 0);

    int result = sea_platform_buffer_is_valid(buffer);
    duk_push_int(context, result);
    return 1;
}
static int duk_sea_platform_buffer_size(duk_context* context) {
    void* buffer = duk_require_pointer(context, 0);

    unsigned long size = sea_platform_buffer_size(buffer);
    duk_push_number(context, (duk_double_t)size);
    return 1;
}
static int duk_sea_platform_buffer_data_as_c_pointer(duk_context* context) {
    void* buffer = duk_require_pointer(context, 0);

    void* data = sea_platform_buffer_data_as_c_pointer(buffer);
    duk_push_pointer(context, data);
    return 1;
}
static int duk_sea_platform_read_file(duk_context* context) {
    const char* filepath = duk_require_string(context, 0);

    void* buffer = sea_platform_read_file(filepath);
    duk_push_pointer(context, buffer);
    return 1;
}
static int duk_sea_platform_write_file(duk_context* context) {
    const char* filepath = duk_require_string(context, 0);
    void* buffer = duk_require_pointer(context, 1);

    int result = sea_platform_write_file(filepath, buffer);
    duk_push_int(context, result);
    return 1;
}

static int duk_sea_platform_buffer_data_to_string(duk_context* context) {
    void* buffer = duk_require_pointer(context, 0);

    duk_push_lstring(context,
                     sea_platform_buffer_data_as_c_pointer(buffer),
                     sea_platform_buffer_size(buffer));
    return 1;
}

static void register_platform(duk_context* context) {
    duk_push_global_object(context);
    duk_push_object(context);

    duk_push_c_function(context, duk_sea_platform_buffer_construct, 1);
    duk_put_prop_string(context, -2, "buffer_construct");
    
    duk_push_c_function(context, duk_sea_platform_buffer_construct_with_buffer, 2);
    duk_put_prop_string(context, -2, "buffer_construct_with_buffer");
    
    duk_push_c_function(context, duk_sea_platform_buffer_construct_with_string, 2);
    duk_put_prop_string(context, -2, "buffer_construct_with_string");
    
    duk_push_c_function(context, duk_sea_platform_buffer_destruct, 1);
    duk_put_prop_string(context, -2, "buffer_destruct");
    
    duk_push_c_function(context, duk_sea_platform_buffer_is_valid, 1);
    duk_put_prop_string(context, -2, "buffer_is_valid");
    
    duk_push_c_function(context, duk_sea_platform_buffer_size, 1);
    duk_put_prop_string(context, -2, "buffer_size");
    
    duk_push_c_function(context, duk_sea_platform_buffer_data_as_c_pointer, 1);
    duk_put_prop_string(context, -2, "buffer_data_as_c_pointer");
    
    duk_push_c_function(context, duk_sea_platform_read_file, 1);
    duk_put_prop_string(context, -2, "read_file");
    
    duk_push_c_function(context, duk_sea_platform_write_file, 2);
    duk_put_prop_string(context, -2, "write_file");


    duk_push_c_function(context, duk_sea_platform_buffer_data_to_string, 1);
    duk_put_prop_string(context, -2, "buffer_data_to_string");
    
    duk_put_prop_string(context, -2, "sea_platform");
    duk_pop(context);
}

static const char* module_loader = "\
Duktape.modSearch = function (id) {\
    if (id === 'fs') {\
        return \"\\\
exports.readFileSync = function (filepath) {\\\
    var fileBuffer = sea_platform.read_file(filepath);\\\
    if (sea_platform.buffer_is_valid(fileBuffer)) {\\\
        var data = sea_platform.buffer_data_to_string(fileBuffer);\\\
        sea_platform.buffer_destruct(fileBuffer);\\\
        return data;\\\
    } else {\\\
        throw new Error('Could not read file: ' + filepath);\\\
    }\\\
};\\\
exports.writeFileSync = function (filepath, data) {\\\
    var buffer = sea_platform.buffer_construct_with_string(data);\\\
    sea_platform.write_file(filepath, buffer);\\\
    sea_platform.buffer_destruct(buffer);\\\
};\";\
    }\
    var fileBuffer = sea_platform.read_file(id + '.js');\
    if (sea_platform.buffer_is_valid(fileBuffer)) {\
        var source = sea_platform.buffer_data_to_string(fileBuffer);\
        sea_platform.buffer_destruct(fileBuffer);\
        return source;\
    } else {\
        throw new Error('module not found: ' + id);\
    }\
};\
\
console = {\
    log: print\
};\
\
print = undefined;";

static void compile_and_execute_module_loader(duk_context* context) {
    int status;
    duk_push_string(context, module_loader);
    duk_push_string(context, "duk.c");

    status = duk_safe_call(context, compile_and_execute, 2, 1);
    if (status != DUK_EXEC_SUCCESS) {
        (void)duk_safe_call(context, get_stack_trace, 1, 1);
        fprintf(stderr, "%s\n", duk_safe_to_string(context, -1));
    } else {
        duk_pop(context);
    }
}

int main(int argc, char* argv[]) {
    void* source;
    int errorCode = -1;
    
    if (argc < 2) {
        fprintf(stderr, "No input file\n");
        return -1;
    }
    
    source = sea_platform_read_file(argv[1]);
    if (sea_platform_buffer_is_valid(source)) {
        int status;
        duk_context* context = duk_create_heap_default();
        duk_push_lstring(context,
                         sea_platform_buffer_data_as_c_pointer(source),
                         sea_platform_buffer_size(source));
        duk_push_string(context, argv[1]);
        sea_platform_buffer_destruct(source);
        
        register_platform(context);
        compile_and_execute_module_loader(context);
        
        arguments = argv;
        argument_count = argc;

        status = duk_safe_call(context, compile_and_execute, 2, 1);
        if (status != DUK_EXEC_SUCCESS) {
            (void)duk_safe_call(context, get_stack_trace, 1, 1);
            fprintf(stderr, "%s\n", duk_safe_to_string(context, -1));
        } else {
            duk_pop(context);
            errorCode = 0;
        }

        duk_destroy_heap(context);
    }

    return errorCode;
}

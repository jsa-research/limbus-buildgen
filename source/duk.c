
#include <stdlib.h>
#include <stdio.h>
#include <duktape.h>

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
    duk_call_method(context, 0);
    duk_pop(context);
    return 0;
}

static char* read_file(char* filepath, unsigned long* final_size) {
    FILE* file = fopen(filepath, "rb");
    if (file) {
        unsigned long file_size = 0;
        unsigned long buffer_size = 1024;
        char* buffer = (char*)malloc(buffer_size);
        
        /* Read until EOF */
        while (feof(file) == 0) {
            int read_bytes = fread(buffer + file_size, 1, buffer_size - file_size, file);
            file_size += read_bytes;
            
            /* Buffer is full, we need to resize it */
            if (file_size == buffer_size) {
                buffer_size *= 1.6f; // Magic number
                char* resized_buffer = (char*)realloc(buffer, buffer_size);

                if (!resized_buffer) {
                    free(buffer);
                    fclose(file);
                    fprintf(stderr, "Out of memory\n");
                    return NULL;
                } else {
                    buffer = resized_buffer;
                }
            }
        }
        
        *final_size = file_size;
        fclose(file);
        return buffer;
        
    } else {
        fprintf(stderr, "Unable to open file %s\n", filepath);
        return NULL;
    }
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        fprintf(stderr, "No input file\n");
        return -1;
    }
    
    unsigned long size;
    char* source = read_file(argv[1], &size);
    if (source) {
        duk_context* context = duk_create_heap_default();
        duk_push_lstring(context, source, size);
        duk_push_string(context, argv[1]);
        free(source);

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

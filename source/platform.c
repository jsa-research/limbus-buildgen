
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "platform.h"

/* Buffer */

typedef struct {
    unsigned long size;
    void* data;
} Buffer;

static void* sea_platform_buffer_construct_with_buffer_no_copy(void* data, unsigned long size) {
    Buffer* buffer = malloc(sizeof(Buffer));
    if (buffer) {
        buffer->size = size;
        buffer->data = data;
    }
    return buffer;
}

void* sea_platform_buffer_construct(unsigned long size) {
    void* data = malloc(size);
    if (data) {
        return sea_platform_buffer_construct_with_buffer(data, size);
    } else {
        return NULL;
    }
}

void* sea_platform_buffer_construct_with_buffer(void* data, unsigned long size) {
    void* copy = malloc(size);
    if (copy) {
        memcpy(copy, data, size);
        return sea_platform_buffer_construct_with_buffer_no_copy(copy, size);
    } else {
        return NULL;
    }
}

void sea_platform_buffer_destruct(void* voidp_buffer) {
    Buffer* buffer = (Buffer*)voidp_buffer;
    free(buffer->data);
    free(buffer);
}

int sea_platform_buffer_is_valid(void* buffer) {
    return buffer != NULL;
}

unsigned long sea_platform_buffer_size(void* voidp_buffer) {
    Buffer* buffer = (Buffer*)voidp_buffer;
    return buffer->size;
}

void* sea_platform_buffer_data_as_c_pointer(void* voidp_buffer) {
    Buffer* buffer = (Buffer*)voidp_buffer;
    return buffer->data;
}

/* File I/O */

void* sea_platform_read_file(const char* filepath) {
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

        fclose(file);
        return sea_platform_buffer_construct_with_buffer(buffer, file_size);
        
    } else {
        fprintf(stderr, "Unable to open file %s\n", filepath);
        return NULL;
    }
}

int sea_platform_write_file(const char* filepath, void* voidp_buffer) {
    Buffer* buffer = (Buffer*)voidp_buffer;
    FILE* file = fopen(filepath, "wb");
    if (file) {
        int written_bytes = fwrite(buffer->data, 1, buffer->size, file);
        fclose(file);
        return written_bytes == buffer->size;

    } else {
        return 0;
    }
}

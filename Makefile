
PLATFORM := Unknown

ifeq ($(OS), Windows_NT)
    PLATFORM = win32
else
    SHELL_UNAME := $(shell uname -s)
    ifeq ($(SHELL_UNAME), Linux)
        PLATFORM = linux
    endif
    ifeq ($(SHELL_UNAME), Darwin)
        PLATFORM = darwin
    endif
    ifeq ($(SHELL_UNAME), FreeBSD)
        PLATFORM = freebsd
    endif
endif

all:
	$(MAKE) -f Makefile.$(PLATFORM)

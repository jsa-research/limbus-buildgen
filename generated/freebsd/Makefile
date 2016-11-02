CC=clang
AR=ar
all:
	$(CC) -c dependencies/duktape-1.5.1/src/duktape.c -o dependencies/duktape-1.5.1/src/duktape.c.o -Idependencies/duktape-1.5.1/src/  -m32
	$(CC) -c source/duk.c -o source/duk.c.o -Idependencies/duktape-1.5.1/src/  -m32
	$(CC) -c source/platform.c -o source/platform.c.o -Idependencies/duktape-1.5.1/src/  -m32
	$(CC) -o generated/limbus-buildgen dependencies/duktape-1.5.1/src/duktape.c.o source/duk.c.o source/platform.c.o   -lm -Wl,-rpath=. -m32

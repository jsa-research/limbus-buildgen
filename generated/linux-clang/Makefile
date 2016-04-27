all:
	clang -c dependencies/duktape-1.4.0/src/duktape.c -o dependencies/duktape-1.4.0/src/duktape.c.o -Idependencies/duktape-1.4.0/src/
	clang -c source/duk.c -o source/duk.c.o -Idependencies/duktape-1.4.0/src/
	clang -c source/platform.c -o source/platform.c.o -Idependencies/duktape-1.4.0/src/
	clang -o generated/limbus-buildgen dependencies/duktape-1.4.0/src/duktape.c.o source/duk.c.o source/platform.c.o  -Wl,-rpath=. -L./ -lm

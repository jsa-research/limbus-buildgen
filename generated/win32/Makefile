CC=cl
AR=lib
all:
	$(CC) /nologo /c /Fodependencies\duktape-1.4.0\src\duktape.c.obj /Idependencies\duktape-1.4.0\src\ dependencies\duktape-1.4.0\src\duktape.c
	$(CC) /nologo /c /Fosource\duk.c.obj /Idependencies\duktape-1.4.0\src\ source\duk.c
	$(CC) /nologo /c /Fosource\platform.c.obj /Idependencies\duktape-1.4.0\src\ source\platform.c
	$(CC) /nologo /Fegenerated\limbus-buildgen dependencies\duktape-1.4.0\src\duktape.c.obj source\duk.c.obj source\platform.c.obj /link

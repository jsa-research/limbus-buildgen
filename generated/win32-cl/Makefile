CC=cl
AR=lib
all:
	$(CC) /NOLOGO /c /Fodependencies\duktape-1.4.0\src\duktape.c.obj /Idependencies\duktape-1.4.0\src\ dependencies\duktape-1.4.0\src\duktape.c
	$(CC) /NOLOGO /c /Fosource\duk.c.obj /Idependencies\duktape-1.4.0\src\ source\duk.c
	$(CC) /NOLOGO /c /Fosource\platform.c.obj /Idependencies\duktape-1.4.0\src\ source\platform.c
	$(CC) /NOLOGO /Fegenerated\limbus-buildgen dependencies\duktape-1.4.0\src\duktape.c.obj source\duk.c.obj source\platform.c.obj /link

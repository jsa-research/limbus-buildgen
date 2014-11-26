all:
	cl /c /Fodependencies\duktape-1.0.1\src\duktape.obj /Idependencies\duktape-1.0.1\src\ dependencies\duktape-1.0.1\src\duktape.c
	cl /c /Fosource\duk.obj /Idependencies\duktape-1.0.1\src\ source\duk.c
	cl /c /Fosource\platform.obj /Idependencies\duktape-1.0.1\src\ source\platform.c
	cl /Feduk dependencies\duktape-1.0.1\src\duktape.obj source\duk.obj source\platform.obj

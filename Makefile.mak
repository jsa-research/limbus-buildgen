all:
	cl dependencies\duktape-1.0.1\src\duktape.c source\duk.c source\platform.c /Idependencies\duktape-1.0.1\src\ /Feduk

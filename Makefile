all:
	gcc dependencies/duktape-1.0.0/src/duktape.c dependencies/duktape-1.0.0/examples/cmdline/duk_cmdline.c -Idependencies/duktape-1.0.0/src/ -o duk


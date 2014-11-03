
all:
	dependencies/fetch_dependencies.sh
	$(MAKE) -f Makefile.$(shell uname -s | tr 'A-Z' 'a-z')

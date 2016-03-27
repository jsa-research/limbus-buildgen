
@echo off

echo Downloading dependencies...
PowerShell -Command "Set-ExecutionPolicy Bypass -Scope Process; dependencies\fetch_dependencies.ps1"

echo Setting up Developer Environment...
call utility-scripts/setenv.bat

echo Compiling...
nmake /f Makefile.win32-cl

echo Done.

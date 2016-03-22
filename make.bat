
@echo off

echo Downloading dependencies...
PowerShell -Command "Set-ExecutionPolicy Bypass -Scope Process; dependencies\fetch_dependencies.ps1"
echo Setting up Visual Studio Developer Command Prompt...
call "C:\Program Files (x86)\Microsoft Visual Studio 16.0\Common7\Tools\VsDevCmd.bat" || call "C:\Program Files (x86)\Microsoft Visual Studio 15.0\Common7\Tools\VsDevCmd.bat" || call "C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\Tools\VsDevCmd.bat" || call "C:\Program Files (x86)\Microsoft Visual Studio 12.0\Common7\Tools\VsDevCmd.bat" || call "C:\Program Files (x86)\Microsoft Visual Studio 11.0\Common7\Tools\vsvars32.bat" || call "C:\Program Files\Microsoft Visual Studio 10.0\VC\vcvarsall.bat" || call "C:\Program Files\Microsoft Visual Studio 9.0\VC\vcvarsall.bat"
echo Compiling...
nmake /f Makefile.win32-cl
echo Done.


:: limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
:: Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
::
:: To the extent possible under law, the author(s) have dedicated all copyright
:: and related and neighboring rights to this software to the public domain worldwide.
:: This software is distributed without any warranty.
::
:: You should have received a copy of the CC0 Public Domain Dedication along with this software.
:: If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

@echo off

:: Exit script if the environment is already set up.
nmake /? 2>NUL >NUL && exit /b

:: Tries to set up development environment starting with the latest visual studio
:: down to the oldest Windows SDK

:: Passes any arguments to the actual implementations.

set SETENV_ARGS=
set SETENV_ARGS_STR=
set VSDEVCMD_ARGS=
set VSDEVCMD_ARGS_STR=

:: Append correct flags
ECHO.%*| FIND /I "x64">Nul && (
  set SETENV_ARGS=/x64 %SETENV_ARGS%
  set VSDEVCMD_ARGS=x86_amd64 %VSDEVCMD_ARGS%
)
ECHO.%*| FIND /I "x86">Nul && (
  set SETENV_ARGS=/x86 %SETENV_ARGS%
  set VSDEVCMD_ARGS=x86 %VSDEVCMD_ARGS%
)
ECHO.%*| FIND /I "Release">Nul && (
  set SETENV_ARGS=/Release %SETENV_ARGS%
)
ECHO.%*| FIND /I "Debug">Nul && (
  set SETENV_ARGS=/Debug %SETENV_ARGS%
)
ECHO.%*| FIND /I "vista">Nul && (
  set SETENV_ARGS=/vista %SETENV_ARGS%
)
ECHO.%*| FIND /I "xp">Nul && (
  set SETENV_ARGS=/xp %SETENV_ARGS%
)
ECHO.%*| FIND /I "2003">Nul && (
  set SETENV_ARGS=/2003 %SETENV_ARGS%
)
ECHO.%*| FIND /I "2008">Nul && (
  set SETENV_ARGS=/2008 %SETENV_ARGS%
)
ECHO.%*| FIND /I "win7">Nul && (
  set SETENV_ARGS=/win7 %SETENV_ARGS%
)

:: Remove trailing space
IF "%SETENV_ARGS%"=="" GOTO SKIP_SETENV_ARGS
set SETENV_ARGS=%SETENV_ARGS:~0,-1%
set SETENV_ARGS_STR=with SetEnv.cmd %SETENV_ARGS%
:SKIP_SETENV_ARGS
IF "%VSDEVCMD_ARGS%"=="" GOTO SKIP_VSDEVCMD_ARGS
set VSDEVCMD_ARGS=%VSDEVCMD_ARGS:~0,-1%
set VSDEVCMD_ARGS_STR=with VsDevCmd.bat %VSDEVCMD_ARGS%
:SKIP_VSDEVCMD_ARGS

:: Actually call the implementations
((call "%programfiles(x86)%\Microsoft Visual Studio 16.0\Common7\Tools\VsDevCmd.bat" %VSDEVCMD_ARGS% 2>NUL) && echo Using Visual Studio 16.0 %VSDEVCMD_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft SDKs\Windows\v12.1\Bin\SetEnv.cmd" %SETENV_ARGS% 2>NUL) && echo Using Windows SDK 12.1 %SETENV_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft SDKs\Windows\v12\Bin\SetEnv.cmd" %SETENV_ARGS% 2>NUL) && echo Using Windows SDK 12 %SETENV_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft Visual Studio 15.0\Common7\Tools\VsDevCmd.bat" %VSDEVCMD_ARGS% 2>NUL) && echo Using Visual Studio 15.0 %VSDEVCMD_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft SDKs\Windows\v11.1\Bin\SetEnv.cmd" %SETENV_ARGS% 2>NUL) && echo Using Windows SDK 11.1 %SETENV_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft SDKs\Windows\v11\Bin\SetEnv.cmd" %SETENV_ARGS% 2>NUL) && echo Using Windows SDK 11 %SETENV_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft SDKs\Windows\v10.1\Bin\SetEnv.cmd" %SETENV_ARGS% 2>NUL) && echo Using Windows SDK 10.1 %SETENV_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft Visual Studio 14.0\Common7\Tools\VsDevCmd.bat" %VSDEVCMD_ARGS% 2>NUL) && echo Using Visual Studio 2015 %VSDEVCMD_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft SDKs\Windows\v10\Bin\SetEnv.cmd" %SETENV_ARGS% 2>NUL) && echo Using Windows SDK 10 [2015] %SETENV_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft Visual Studio 12.0\Common7\Tools\VsDevCmd.bat" %VSDEVCMD_ARGS% 2>NUL) && echo Using Visual Studio 2013 %VSDEVCMD_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft SDKs\Windows\v8.1\Bin\SetEnv.cmd" %SETENV_ARGS% 2>NUL) && echo Using Windows SDK 8.1 [2013] %SETENV_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft Visual Studio 11.0\Common7\Tools\vsvars32.bat" %VSDEVCMD_ARGS% 2>NUL) && echo Using Visual Studio 2012 %VSDEVCMD_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft SDKs\Windows\v8.0\Bin\SetEnv.cmd" %SETENV_ARGS% 2>NUL) && echo Using Windows SDK 8.0 [2012] %SETENV_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft SDKs\Windows\v7.1\Bin\SetEnv.cmd" %SETENV_ARGS% 2>NUL) && echo Using Windows SDK 7.1 [2010] %SETENV_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft Visual Studio 10.0\VC\vcvarsall.bat" %VSDEVCMD_ARGS% 2>NUL) && echo Using Visual Studio 2010 %VSDEVCMD_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft SDKs\Windows\v7.0\Bin\SetEnv.cmd" %SETENV_ARGS% 2>NUL) && echo Using Windows SDK 7.0 [2009] %SETENV_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft Visual Studio 9.0\VC\vcvarsall.bat" %VSDEVCMD_ARGS% 2>NUL) && echo Using Visual Studio [2008] %VSDEVCMD_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft SDKs\Windows\v6.1\Bin\SetEnv.cmd" %SETENV_ARGS% 2>NUL) && echo Using Windows SDK 6.1 [2007] %SETENV_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft SDKs\Windows\v6.0\Bin\SetEnv.cmd" %SETENV_ARGS% 2>NUL) && echo Using Windows SDK 6.0 [2006] %SETENV_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft Visual Studio 8\VC\vcvarsall.bat" %VSDEVCMD_ARGS% 2>NUL) && echo Using Visual Studio 2005 %VSDEVCMD_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft Visual Studio 7\VC\vcvarsall.bat" %VSDEVCMD_ARGS% 2>NUL) && echo Using Visual Studio .NET [2002] %VSDEVCMD_ARGS_STR%) || ((call "%programfiles(x86)%\Microsoft Visual Studio\vc98\bin\vcvars32.bat" %VSDEVCMD_ARGS% 2>NUL) && echo Using Visual Studio 6.0 [1998] %VSDEVCMD_ARGS_STR%)

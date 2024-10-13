@echo off
if "%1"=="" goto usage

REM Extract the filename without the extension
set filename=lab1

REM Define the .asm file (add .asm to the base filename)
set asmfile=lab1.asm

REM Check if the .asm file exists

echo Compiling %asmfile%
masm %asmfile%;
if errorlevel 1 goto masm_error

echo Linking %filename%.obj
echo %filename%.obj > link.tmp
echo %filename%.exe >> link.tmp
echo NUL >> link.tmp
echo NUL >> link.tmp
link < link.tmp
if errorlevel 1 goto link_error

del link.tmp
echo Compilation and linking successful. Created %filename%.exe
goto end

:masm_error
echo Compilation failed.
goto end

:link_error
echo Linking failed.
del link.tmp
goto end

:usage
echo Usage: compil filename.asm
goto end

:end


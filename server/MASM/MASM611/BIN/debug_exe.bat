@echo off
REM Check if a filename was provided
if "%1"=="" (
    echo Usage: %0 filename.exe
    exit /b 1
)

REM Extract filename without extension
set "filename=%~n1"

REM Create a debug script file
echo n %filename%.exe > debug_commands.txt
echo r >> debug_commands.txt
echo t >> debug_commands.txt
echo r >> debug_commands.txt
echo q >> debug_commands.txt

REM Run DEBUG with the command file and output to a text file
debug < debug_commands.txt > debug_output.txt

REM Clean up the debug script file
del debug_commands.txt

REM Extract register values from the debug output
findstr /C:"AX =" /C:"BX =" /C:"CX =" /C:"DX =" /C:"SP =" /C:"BP =" /C:"SI =" /C:"DI =" /C:"DS =" /C:"ES =" /C:"SS =" /C:"CS =" /C:"IP =" /C:"NV UP EI PL NZ NA PO NC" debug_output.txt > %filename%_registers.txt

REM Clean up the full debug output file
del debug_output.txt

echo Debug complete. Register values saved in %filename%_registers.txt
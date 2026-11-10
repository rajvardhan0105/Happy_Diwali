@echo off
title Shubh Diwali Wish Website Launcher
color 0E
cls
echo ===============================================================
echo            * SHUBH DIWALI GREETINGS WEB APPLICATION *
echo ===============================================================
echo.
echo  Starting Python Web Server...
echo  Your default web browser will open automatically at:
echo  http://127.0.0.1:5000
echo.
echo  Tip: You can also directly double-click index.html anytime!
echo.
echo  To stop the server, press Ctrl + C or close this window.
echo ===============================================================
echo.
cd /d "%~dp0"
python app.py
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Python was not found in PATH or encountered an issue.
    echo [*] Opening index.html directly in your default browser...
    start index.html
)
pause

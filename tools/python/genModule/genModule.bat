@echo off
setlocal enabledelayedexpansion
chcp 65001
echo "请输入新增的模块名字，比如player"
set projectName="client"
if not "%1"=="" (
    set projectName="%1"
)
set /p module="-->:"
call python genModule.py %module% %projectName%

if "%1"=="" (
    pause
)
@echo off  
setlocal enabledelayedexpansion

:Start
set workPath=%~dp0
set resPath="client"
set /p myCHOOSE="please choose[1.res 2.protocol 3.module 4.conf]:"
if "%myCHOOSE%"=="1" goto RES
if "%myCHOOSE%"=="2" goto PROTOCOL
if "%myCHOOSE%"=="3" goto MODULE
if "%myCHOOSE%"=="4" goto CONF

goto end

:RES
set /p resPath="please enter path:"

if exist %workPath%\%resPath% (

) else (
    echo "not exist files"
)
goto Start

:PROTOCOL
pushd %workPath%\doc\protocol
call buildProto.bat %resPath%
popd
goto Start

:CONF
pushd %workPath%\doc
call parseConfig.bat %resPath%
popd
goto Start

:MODULE
pushd %workPath%\tools\python\genModule
call genModule.bat %resPath%
popd
goto Start

:end
goto Start

exit

@ echo off  
set workPath=%~dp0


if exist %workPath%\client.xls (
    java -jar %workPath%\..\tools\toolsCode\xls2js.jar %workPath%\client.xls %workPath%
) else (
    echo "not exist files"
)

pause

exit

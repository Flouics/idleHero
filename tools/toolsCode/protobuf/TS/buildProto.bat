@echo off
set protoName="protoData"
set protoOutName="proto"
set protoPath="/../%protoName%.proto"
set outPathJS="/../../../../client/assets/script/proto/"
rem set outPathDTS="/../../../../assets/script/proto/"

xcopy %cd%%protoPath% %cd% /f /y
call pbjs -t static-module -w commonjs -o %protoOutName%.js %protoName%.proto
call pbts -o %protoOutName%.d.ts %protoOutName%.js
xcopy %protoOutName%.js %cd%%outPathJS% /f /y
xcopy %protoOutName%.d.ts %cd%%outPathJS% /f /y
del %protoName%.proto

echo "proto done"

if "%1"=="" (
    pause
)

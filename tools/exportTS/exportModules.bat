@echo off  

set workPath=%~dp0..\
set scriptPath=%workPath%assets\script\
rem set moduleList= %scriptPath%modules\time\TimeProxy.ts %scriptPath%utils\ToolKit.ts %scriptPath%Platform.ts  %scriptPath%ase\BaseClass.ts
set moduleList= %scriptPath%modules\time\TimeProxy.ts
set modulePathList=""
(for %%a in (%moduleList%) do (
    if exist %scriptPath%%%a.ts (
        set modulePathList=%modulePathList% %scriptPath%%%a.ts
    )
))
echo %moduleList%
call tsc F:\CCProject\boss\client\assets\script\modules\time\TimeProxy.ts --outFile %workPath%__set\modules.d.ts -d --emitDeclarationOnly --isolatedModules

if "%1"=="" (
    pause
)
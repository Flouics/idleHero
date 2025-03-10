#coding=utf-8

##作用：复制活动。

import os,re,sys
import codecs

#sys.path.append('../')
# print(os.path.dirname(Path))获取当前程序的父目录的绝对路径
BASE_DIR=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
#将BASE_DIR添加到系统环境变量中
print(BASE_DIR)
sys.path.append(BASE_DIR)
from common import utils

cd = os.path.dirname(os.path.abspath(__file__))

modulesDir = os.path.join(BASE_DIR,"../../client/assets/script/modules/")
srcModule = "template"

def getKeysDirct(module = "None"):
    keysDict = {}
    moduleClassName = module.capitalize()
    srcModuleClassName = srcModule.capitalize()
    
    keysDict[srcModule] = module
    keysDict[srcModuleClassName] = moduleClassName
    return keysDict

def main(module = "",project = "client"):
    print(f"project is {project}")
    modulesDir = os.path.join(BASE_DIR,f"../../{project}/assets/script/modules/")
    outDir = os.path.join(modulesDir,module)    
    if utils.isPathExist(outDir):
        print(outDir)
        print(f"module {module} already exists")
        return False
    
    allKeysDict = getKeysDirct(module)
    
    moduleClassName = module.capitalize()
    srcModuleClassName = srcModule.capitalize()
    srcDir = os.path.join(modulesDir,srcModule)
    for root, dirs, files in os.walk(srcDir):
        for file in files:
            if file.endswith(".meta"):
                pass
            else:
                srcFilePath = os.path.join(root, file)
                newFile = file.replace(srcModuleClassName,moduleClassName)            
                newFilePath = os.path.join(root.replace(srcModule,module), newFile)
                
                print(f"copy {file} -> {newFile} ")
                utils.mkdirs(newFilePath)
                with codecs.open(srcFilePath, 'r',encoding='utf-8') as f:
                    with codecs.open(newFilePath, 'w',encoding='utf-8') as newf:
                        lines = f.readlines()
                        for line in lines:
                            for key in allKeysDict:
                                line = line.replace(key,allKeysDict[key])
                            newf.write(line)


if __name__ == "__main__" :    
    module = ""
    project = "client_3"
    if len(sys.argv) > 1:
        module = sys.argv[1]
    if len(sys.argv) > 2:
        project = sys.argv[2]
    if module == "":
        print("please enter a module name")
    else:
        main(module,project)
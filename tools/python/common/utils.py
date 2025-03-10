#coding=utf-8

import os
import shutil
import re
from common import langconv

#创建文件对应的目录
def mkdirs(file):
    path = os.path.dirname(file)
    path = path.strip()
    # 判断路径是否存在
    # 存在     True
    # 不存在   False
    isExists = os.path.exists(path)

    # 判断结果
    if not isExists:
        # 如果不存在则创建目录
        # 创建目录操作函数
        os.makedirs(path)
        return True
    else:
        return False

#创建相对文件对应的目录
def mkdirs_by_relative(file_relative):
    file_path = file_relative
    if file_relative.startswith('/'):
        file_path = file_relative.replace('/','',1)
    file = os.path.join(os.getcwd(),file_path)
    return mkdirs(file)

# 删除文件夹
def removedirs(path):
    if os.path.exists(path):
        shutil.rmtree(path)


# 去除空格和换行
def trim(str):
    s = str.strip()
    s = s.replace(r'\n\r',"")
    return s


# 转换繁体到简体
def cht_to_chs(line):
    line = langconv.converter('zh-hans').convert(line)
    line.encode('utf-8')
    return line

 # 转换简体到繁体
def chs_to_cht(line):
    line = langconv.converter('zh-hant').convert(line)
    line.encode('utf-8')
    return line

def renameFileExt(file,ext_old,ext_new):
    name,ext = os.path.splitext(file) # 返回文件名和后缀
    ret = file
    if ext == ext_old:
        ret = name + ext_new
    return ret

#不改变后缀名，只改文件名
def rename(path,newName):
    dir,fileName = os.path.split(path) #分离路径和文件名（含后缀）
    name,ext = os.path.splitext(fileName) # 返回文件名和后缀
    return os.path.join(dir,fileName.replace(name,str(newName)))   

#只返回文件名，包含后缀
def getFileName(path):
    dir,fileName = os.path.split(path) #分离路径和文件名（含后缀）
    return fileName

def isPathExist(path):   
    return os.path.exists(path)

def copyfile(srcFilePath, destFilePath):
    mkdirs(destFilePath)
    shutil.copyfile(srcFilePath,destFilePath)
    
def fixFilePath(filePath):  #处理文件路径系统差别，统一处理/
    ret = trim(filePath)
    return ret

def fixFilePathStandard(filePath):
    ret = filePath.replace("\\","/")
    return ret

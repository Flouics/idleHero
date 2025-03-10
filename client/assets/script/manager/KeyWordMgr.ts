import BaseClass from "../zero/BaseClass";

/*
 验证数字的正则表达式集
 验证数字：^[0-9]*$
 验证n位的数字：^\d{n}$
 验证至少n位数字：^\d{n,}$
 验证m-n位的数字：^\d{m,n}$
 验证零和非零开头的数字：^(0|[1-9][0-9]*)$
 验证有两位小数的正实数：^[0-9]+(.[0-9]{2})?$
 验证有1-3位小数的正实数：^[0-9]+(.[0-9]{1,3})?$
 验证非零的正整数：^\+?[1-9][0-9]*$
 验证非零的负整数：^\-[1-9][0-9]*$
 验证非负整数（正整数 + 0） ^\d+$
 验证非正整数（负整数 + 0） ^((-\d+)|(0+))$
 验证长度为3的字符：^.{3}$
 验证由26个英文字母组成的字符串：^[A-Za-z]+$
 验证由26个大写英文字母组成的字符串：^[A-Z]+$
 验证由26个小写英文字母组成的字符串：^[a-z]+$
 验证由数字和26个英文字母组成的字符串：^[A-Za-z0-9]+$
 验证由数字、26个英文字母或者下划线组成的字符串：^\w+$
 验证用户密码:^[a-zA-Z]\w{5,17}$ 正确格式为：以字母开头，长度在6-18之间，只能包含字符、数字和下划线。
 验证是否含有 ^%&',;=?$\" 等字符：[^%&',;=?$\x22]+
 验证汉字：^[\u4e00-\u9fa5],{0,}$
 验证Email地址：/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
 验证InternetURL：^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$ ；^[a-zA-z]+://(w+(-w+)*)(.(w+(-w+)*))*(?S*)?$
 验证电话号码：^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$：--正确格式为：XXXX-XXXXXXX，XXXX-XXXXXXXX，XXX-XXXXXXX，XXX-XXXXXXXX，XXXXXXX，XXXXXXXX。
 验证身份证号（15位或18位数字）：^\d{15}|\d{}18$
 验证一年的12个月：^(0?[1-9]|1[0-2])$ 正确格式为：“01”-“09”和“1”“12”
 验证一个月的31天：^((0?[1-9])|((1|2)[0-9])|30|31)$ 正确格式为：01、09和1、31。
 整数：^-?\d+$
 非负浮点数（正浮点数 + 0）：^\d+(\.\d+)?$
 正浮点数 ^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$
 非正浮点数（负浮点数 + 0） ^((-\d+(\.\d+)?)|(0+(\.0+)?))$
 负浮点数 ^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$
 浮点数 ^(-?\d+)(\.\d+)?$

 */
export default class KeyWordMgr extends BaseClass {
    sensitiveWordMap = {};    

    isContainsSensitiveWord(s: string) {
        if (s.length < 1) {
            return false;
        }
        s = s.toLowerCase();
        for (var i = 0; i < s.length; i++) {
            for (var j = i; j <= s.length; j++) {
                var goal = s.toString().substring(i, j);
                if (this.sensitiveWordMap[goal]) {
                    return true;
                }
            }
        }
        return false;
    };

    //表情检测
    isEmoji(s: string) {
        if (s.length < 1) {
            return false;
        }
        // "\ud83c[\udc00-\udfff]|\ud83d[\udc00-\udfff]"为emoji表情
        if (s.match(/\ud83c[\udc00-\udfff]|\ud83d[\udc00-\udfff]/g) != null) {
            return true;
        }

        return false;
    };

    //不支持的字符
    isNonSupport(s: string) {
        if (s.length < 1) {
            return false;
        }
        // 具体编码参考unicode编码表（如：2800-28ff是盲文字符） 多语言的关系有需要再添加
        if (s.match(/[\u256d-\u257f]|[\u2600-\u297f]/g) != null) {
            return true;
        }
        return false;
    }

    replaceKeyWord(s: string, replace_str: string) {
        if (replace_str == undefined) replace_str = '';
        var ret: string;
        if (s.length < 1) {
            return s;
        }

        //防注入。
        var reg = /[\(\)\[\]\{\}\^\|\?\+\.'";,]/
        ret = s.toString().replace(reg, '*');

        for (var i = 0; i < s.length; i++) {
            for (var j = i; j <= s.length; j++) {
                var goal = ret.toString().substring(i, j);
                if (this.sensitiveWordMap[goal]) {
                    var replaceStr = '';
                    for (var k = 0; k < j - i; k++) {
                        replaceStr += '*';
                    }

                    if (replaceStr.length > 0) {
                        ret = ret.toString().replace(goal, replaceStr);
                    }

                }
            }
        }
        return ret;
    };

    //通用字符串检查。
    isStringValid(_string: string) {
        var errorCode = 0;
        //防注入。
        var reg = /[\(\)\[\]\{\}\^\|\?\+\.'";,]/;
        if (reg.test(_string)) {
            errorCode = 1;
            return errorCode;
        }
        // 脏字
        if (this.isContainsSensitiveWord(_string)) {
            errorCode = 2;
            //return errorCode;
        }
        // emoji
        if (this.isEmoji(_string)) {
            errorCode = 3;
            return errorCode;
        }
        // 字体不支持的字符
        if (this.isNonSupport(_string)) {
            errorCode = 4;
            return errorCode;
        }
        return errorCode;
    };
};
export default class Lunar {
    //获取农历

    getLunar(time_stamp:number) {
        var CalendarData = new Array(20);
        var madd = new Array(12);
        var theDate:Date = time_stamp == undefined ? new Date() : new Date(time_stamp);
        var tgString = "甲乙丙丁戊己庚辛壬癸";
        var dzString = "子丑寅卯辰巳午未申酉戌亥";
        var numString = "一二三四五六七八九十";
        var monString = "正二三四五六七八九十冬腊";
        var weekString = "日一二三四五六";
        var sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
        var cYear:any;
        var cMonth:any;
        var cDay:any;
        var cHour:any;
        var cDateString:any;
        var DateString:any;

        function init() {
            CalendarData[0] = 0x41A95;
            CalendarData[1] = 0xD4A;
            CalendarData[2] = 0xDA5;
            CalendarData[3] = 0x20B55;
            CalendarData[4] = 0x56A;
            CalendarData[5] = 0x7155B;
            CalendarData[6] = 0x25D;
            CalendarData[7] = 0x92D;
            CalendarData[8] = 0x5192B;
            CalendarData[9] = 0xA95;
            CalendarData[10] = 0xB4A;
            CalendarData[11] = 0x416AA;
            CalendarData[12] = 0xAD5;
            CalendarData[13] = 0x90AB5;
            CalendarData[14] = 0x4BA;
            CalendarData[15] = 0xA5B;
            CalendarData[16] = 0x60A57;
            CalendarData[17] = 0x52B;
            CalendarData[18] = 0xA93;
            CalendarData[19] = 0x40E95;
            madd[0] = 0;
            madd[1] = 31;
            madd[2] = 59;
            madd[3] = 90;
            madd[4] = 120;
            madd[5] = 151;
            madd[6] = 181;
            madd[7] = 212;
            madd[8] = 243;
            madd[9] = 273;
            madd[10] = 304;
            madd[11] = 334;
        }


        function GetBit(m:number, n:number) {
            return (m >> n) & 1;
        }


        function e2c() {
            var total:any, m:any, n:any, k:any;
            var isEnd = false;
            var tmp = theDate.getFullYear();
            if (tmp < 1900) tmp += 1900;
            total = (tmp - 2001) * 365
                + Math.floor((tmp - 2001) / 4)
                + madd[theDate.getMonth()]
                + theDate.getDate()
                - 23;
            if (theDate.getFullYear() % 4 == 0 && theDate.getMonth() > 1)
                total++;
            for (m = 0; ; m++) {
                k = (CalendarData[m] < 0xfff) ? 11 : 12;
                for (n = k; n >= 0; n--) {
                    if (total <= 29 + GetBit(CalendarData[m], n)) {
                        isEnd = true;
                        break;
                    }
                    total = total - 29 - GetBit(CalendarData[m], n);
                }
                if (isEnd) break;
            }
            cYear = 2001 + m;
            cMonth = k - n + 1;
            cDay = total;
            if (k == 12) {
                if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1)
                    cMonth = 1 - cMonth;
                if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1)
                    cMonth--;
            }
            cHour = Math.floor((theDate.getHours() + 3) / 2);
        }

        function GetLunarDate() {
            var lunar = {
                tg: tgString.charAt((cYear - 4) % 10),      //年干
                dz: dzString.charAt((cYear - 4) % 12),      //年支
                sx: sx.charAt((cYear - 4) % 12),            //生肖
                year: cYear,                                //农历年 相对值
                month: monString.charAt(cMonth - 1),        //月
                day:"",                                     //天
                hour:"",                                    //小时                          
                sx_index: (cYear - 4) % 12,                 //生肖索引
                is_leap: cMonth < 1,                    //闰月
            };

            lunar.day = (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "卅"));
            if (cDay % 10 != 0 || cDay == 10)
                lunar.day += numString.charAt((cDay - 1) % 10);

            lunar.hour = dzString.charAt((cHour - 1) % 12);
            if (cHour == 13) {
                lunar.hour += "夜";
            }

            return lunar;
        }

        init();
        e2c();
        return GetLunarDate();
    };
};

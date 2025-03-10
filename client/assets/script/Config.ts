//  平台配置
export default class Config {
    /*
     * 是否测试环境 非正式发布包需要打开
     *  0,	    // 正式服
     *  1,		// 测试服
     *  2,		// 开发服
     */

    server_type:number = 2;

    /*
     * 对应ios和android发送版本id
     */
    version:string = '1.0.0';

    /*
     * 是否需要重启虚拟机的版本
     */
    core_version:string = '0';

    /*
     * 设备ID
     * 微信登录用
     */
    device_id:string = "aa.bb.ddc004";

};





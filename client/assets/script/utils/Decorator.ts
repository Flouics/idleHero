import "reflect-metadata";
export const SerializeMetaKey = "serialize";

//序列化装饰器
export function serialize(name?: string) {
    return (target: Object, property: string): void => {
        Reflect.defineMetadata(SerializeMetaKey, name || property, target, property);
    };
}

//序列化
export function objToJson(obj:Object): any {
    const ret = {};
    if (obj instanceof Array){
        for (let index = 0; index < obj.length; index++) {
            ret[index] = objToJson(obj[index])            
        }
    }else{
        Object.keys(obj).forEach( property => {
            const serialize = Reflect.getMetadata(SerializeMetaKey, obj, property);
            if (serialize) {       
                ret[serialize] = obj[property];
            }
        });
    }  
    return JSON.stringify(ret);
}

//反序列化
export function jsonToObj(obj:Object,json:string = "") {
    try {
        let json2obj = JSON.parse(json);
        Object.keys(obj).forEach( property => {
            const serialize = Reflect.getMetadata(SerializeMetaKey, obj, property);
            if (serialize && json2obj[serialize] !== undefined) {     
                obj[property] = json2obj[serialize];
            }
        });
    } catch (error) {
        console.error(error,"fromJson is Failed",json);
    }
}
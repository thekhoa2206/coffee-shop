import { isNil } from "lodash";

export default class UrlEncoder {
  static encode(params: Object, prefix?: string, objParam?: Record<string, any>) {
    try {
      let items: any[] = [];
      Object.entries(params).forEach(([key, value]) => {
        let _key = prefix ? prefix + "." + key : key;
        let type = typeof value;
        switch (type) {
          case "object":
            if (Array.isArray(value)) {
              if (value.length > 0) {
                if (objParam) objParam[_key] = value;
                items.push(_key + "=" + encodeURIComponent(value.toString()));
              }
            } else {
              let _param = this.encode(value, _key, objParam);
              if (_param) items = items.concat(_param);
            }
            break;
          case "function":
            break;
          default:
            if (!isNil(value) && value !== "") {
              if (objParam) objParam[_key] = value;
              items.push(_key + "=" + encodeURIComponent(value as any));
            }
            break;
        }
      });
      return items.length > 0 ? items.join("&") : "";
    } catch (e) {
      return "";
    }
  }

  static getParamObject(filters: Object) {
    let objParam = {};
    this.encode(filters, undefined, objParam);
    return objParam;
  }

  static decode(params: any) {
    if (!params) return {};
    try {
      let obj: any = {};
      let parts = params.split("&");
      parts.forEach((kvs: any) => {
        let kvp = kvs.split("=");
        let key = kvp[0];
        let val = decodeURIComponent(kvp[1]);

        if (key.split(".").length > 1) {
          let top = key.split(".")[0];
          let sub = key.split(".").slice(1);
          if (!obj[top]) {
            obj[top] = {};
          }
          let unRoot = function (o: any) {
            if (sub === null) return;
            let sub_key = sub[0];
            sub = sub?.[1] ? sub.slice(1) : null;
            if (!o[sub_key]) {
              o[sub_key] = sub ? {} : val;
            }
            unRoot(o[sub_key]);
          };
          unRoot(obj[top]);
        } else {
          obj[key] = val;
        }
      });
      return obj;
    } catch (e) {
      return {};
    }
  }
}

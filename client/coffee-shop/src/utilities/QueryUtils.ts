export default class QueryUtils {
  static buildQueryString(obj: Record<string, any>): string {
    const queryObject = Object.entries(obj).reduce((a: { [key: string]: any }, [k, v]) => {
      if (v == null) {
        return a;
      } else if (typeof v === "string" && v.trim().length === 0) {
        return a;
      }
      a[k] = v;
      return a;
    }, {});
    return new URLSearchParams(queryObject).toString();
  }
}

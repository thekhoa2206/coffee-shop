import { upperFirst } from "lodash";

export function CapitalizeString(inputVal: String) {
  let result = "";
  if (inputVal) {
    let inputArr = inputVal.split(" ");
    inputArr.forEach(function (item, index) {
      if (index > 0 && result !== "") {
        result += " ";
      }
      result += upperFirst(item);
    });
  }
  return result;
}

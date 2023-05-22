export const replaceSpecialCharacterSqlQuery = (text: string) => {
  let result: string;
  result = text.replace(/&/g, "CHAR(38)");
  result = result.replace(/#/g, "CHAR(35)");
  result = result.replace(/"/g, "CHAR(147)");
  result = result.replace(/\+/g, "CHAR(43)");
  return result;
};

export const decodeSpecialCharacterSqlQuery = (text: string) => {
  let result: string;
  result = text.replace(/CHAR\(38\)/g, "&");
  result = result.replace(/CHAR\(35\)/g, "#");
  result = result.replace(/CHAR\(147\)/g, '"');
  result = result.replace(/CHAR\(43\)/g, "+");
  return result;
};

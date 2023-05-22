export const LIMIT_NUMBER = 9999999999;

export const formatQuantity = (
  value: number,
  locale: string = "vi-VN",
  options: Intl.NumberFormatOptions = {}
): string => {
  return new Intl.NumberFormat(locale, options).format(value);
};

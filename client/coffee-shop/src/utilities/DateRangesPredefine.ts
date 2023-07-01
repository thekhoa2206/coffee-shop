import moment from "moment";

export const DateRangesPredefineType = {
  TODAY: "today",
  YESTERDAY: "yesterday",
  DAY_LAST_7: "day_last_7",
  DAY_LAST_30: "day_last_30",
  THIS_WEEK: "this_week",
  LAST_WEEK: "last_week",
  THIS_MONTH: "this_month",
  LAST_MONTH: "last_month",
  THIS_YEAR: "this_year",
  LAST_YEAR: "last_year",
};

export const convertPredefinedToDate = (type: string) => {
  switch (type) {
    case DateRangesPredefineType.TODAY:
      return { startDate: moment().toDate(), endDate: moment().toDate() };
    case DateRangesPredefineType.YESTERDAY:
      return { startDate: moment().subtract(1, "days").toDate(), endDate: moment().subtract(1, "days").toDate() };
    case DateRangesPredefineType.DAY_LAST_7:
      return { startDate: moment().subtract(7, "days").toDate(), endDate: moment().toDate() };
    case DateRangesPredefineType.DAY_LAST_30:
      return { startDate: moment().subtract(30, "days").toDate(), endDate: moment().toDate() };
    case DateRangesPredefineType.THIS_WEEK:
      return { startDate: moment().startOf("weeks").subtract(1, "weeks").toDate(), endDate: moment().toDate() };
    case DateRangesPredefineType.LAST_WEEK:
      return {
        startDate: moment().subtract(1, "days").subtract(1, "weeks").startOf("week").add(1, "days").toDate(),
        endDate: moment().subtract(1, "days").subtract(1, "weeks").endOf("week").add(1, "days").toDate(),
      };
    case DateRangesPredefineType.THIS_MONTH:
      debugger
      return { startDate: moment().startOf("month").toDate(), endDate: moment().toDate() };
    case DateRangesPredefineType.LAST_MONTH:
      return {
        startDate: moment().subtract(1, "months").startOf("month").toDate(),
        endDate: moment().subtract(1, "months").endOf("month").toDate(),
      };
    case DateRangesPredefineType.THIS_YEAR:
      return { startDate: moment().startOf("years").toDate(), endDate: moment().toDate() };
    case DateRangesPredefineType.LAST_YEAR:
      return {
        startDate: moment().subtract(1, "years").startOf("years").toDate(),
        endDate: moment().subtract(1, "years").endOf("years").toDate(),
      };
    default:
      return { startDate: new Date(), endDate: new Date() };
  }
};

export const convertStartEndDateToString = (startDate: Date, endDate: Date) => {
  return `${moment(startDate).format("DD/MM/YYYY")} - ${moment(endDate).format("DD/MM/YYYY")}`;
};

export const getNameAndDatePredefined = (key: string) => {
  let date = convertPredefinedToDate(key);
  let dateRangeString = convertStartEndDateToString(date.startDate, date.endDate);
  let a = `${getNamePredefinedDate(key)} `;
  switch (key) {
    case DateRangesPredefineType.TODAY:
    case DateRangesPredefineType.YESTERDAY:
      return `${a} (${moment(date.startDate).format("DD/MM/YYYY")})`;
    case DateRangesPredefineType.THIS_WEEK:
    case DateRangesPredefineType.LAST_WEEK:
    case DateRangesPredefineType.THIS_MONTH:
    case DateRangesPredefineType.LAST_MONTH:
    case DateRangesPredefineType.DAY_LAST_7:
    case DateRangesPredefineType.DAY_LAST_30:
    case DateRangesPredefineType.THIS_YEAR:
    case DateRangesPredefineType.LAST_YEAR:
      return `${a} (${dateRangeString})`;
    default:
      return "";
  }
};

export const getNamePredefinedDate = (key: string) => {
  switch (key) {
    case DateRangesPredefineType.TODAY:
      return `Hôm nay`;
    case DateRangesPredefineType.YESTERDAY:
      return `Hôm qua`;
    case DateRangesPredefineType.THIS_WEEK:
      return `Tuần này`;
    case DateRangesPredefineType.LAST_WEEK:
      return `Tuần trước`;
    case DateRangesPredefineType.THIS_MONTH:
      return `Tháng này`;
    case DateRangesPredefineType.LAST_MONTH:
      return `Tháng trước`;
    case DateRangesPredefineType.LAST_YEAR:
      return `Năm trước`;
    case DateRangesPredefineType.THIS_YEAR:
      return `Năm nay`;
    case DateRangesPredefineType.DAY_LAST_7:
      return `7 ngày qua`;
    case DateRangesPredefineType.DAY_LAST_30:
      return `30 ngày qua`;
    default:
      return "";
  }
};

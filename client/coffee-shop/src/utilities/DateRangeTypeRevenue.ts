import i18n from "i18n";

export const DateRangeType = {
  YESTERDAY: "yesterday",
  TODAY: "today",
  THIS_WEEK: "this_week",
  THIS_MONTH: "this_month",
  LAST_MONTH: "last_month",
  DAY_LAST_7: "day_last_7",
  DAY_LAST_30: "day_last_30",
  DAY_LAST_60: "day_last_60",
  DAY_LAST_90: "day_last_90",
  THIS_YEAR: "this_year",
  LAST_YEAR: "last_year",
};
export const GetListDateRange: string[] = [
  DateRangeType.TODAY,
  DateRangeType.YESTERDAY,
  DateRangeType.DAY_LAST_7,
  DateRangeType.THIS_MONTH,
  DateRangeType.LAST_MONTH,
  DateRangeType.THIS_YEAR,
  DateRangeType.LAST_YEAR,
];
export const GetListDateDashboardRange: string[] = [
  DateRangeType.TODAY,
  DateRangeType.YESTERDAY,
  DateRangeType.DAY_LAST_7,
  DateRangeType.THIS_MONTH,
  DateRangeType.LAST_MONTH,
  DateRangeType.THIS_YEAR,
];
export const GetListDateRangeOrderHandle: string[] = [
  DateRangeType.TODAY,
  DateRangeType.YESTERDAY,
  DateRangeType.DAY_LAST_7,
  DateRangeType.DAY_LAST_30,
];
export const GetNameDateRangeType = (type: string) => {
  switch (type) {
    case DateRangeType.YESTERDAY: {
      return `Hôm qua`;
    }
    case DateRangeType.TODAY: {
      return `Hôm nay`;
    }
    case DateRangeType.THIS_WEEK: {
      return `Tuần này`;
    }
    case DateRangeType.THIS_MONTH: {
      return `Tháng này`;
    }
    case DateRangeType.LAST_MONTH: {
      return `Tháng trước`;
    }
    case DateRangeType.DAY_LAST_7: {
      return `Tuần trước`;
    }
    case DateRangeType.DAY_LAST_30: {
      return `30 ngày truóc`;
    }
    case DateRangeType.DAY_LAST_60: {
      return `60 ngày trước`;
    }
    case DateRangeType.DAY_LAST_90: {
      return `90 ngày trước`;
    }
    case DateRangeType.THIS_YEAR: {
      return "Năm nay";
    }
    default:
      return "";
  }
};

import i18next from "i18next";

const t = i18next.getFixedT(null, ["component", "accounts"]);
export const ReportInventoryQuickFilterOptions = {
  NAME: "ingredientName",
  STARTAMOUNT: "startAmount",
  ENDAMOUNT: "endAmount",
  AMOUNTDECREASE: "amountDecrease",
  AMOUNTINCREASE: "amountIncrease",
  AMOUNTPUSRCHASE: "amountPurchase",
  UNITNAME: "unitName",
  TOTALCODE: "totalCode",
};

export const getReportInventoryQuickFilterLabel = (key: string) => {
  switch (key) {
    case ReportInventoryQuickFilterOptions.NAME:
      return `Tên nguyên liệu`;
    case ReportInventoryQuickFilterOptions.STARTAMOUNT:
      return `Số lượng đầu kỳ`;
    case ReportInventoryQuickFilterOptions.ENDAMOUNT:
      return `Số lượng cuối kỳ`;
    case ReportInventoryQuickFilterOptions.AMOUNTDECREASE:
      return `Bán`;
    case ReportInventoryQuickFilterOptions.AMOUNTINCREASE:
      return `nhập`;
    case ReportInventoryQuickFilterOptions.AMOUNTPUSRCHASE:
      return `xuất`;
    case ReportInventoryQuickFilterOptions.UNITNAME:
      return `Đơn vị `;
      case ReportInventoryQuickFilterOptions.TOTALCODE:
        return `Giá trị tồn `;
    default:
      return "";
  }
};

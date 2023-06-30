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
      return `Số lượng bán`;
    case ReportInventoryQuickFilterOptions.AMOUNTINCREASE:
      return `Nhập`;
    case ReportInventoryQuickFilterOptions.AMOUNTPUSRCHASE:
      return `Xuất`;
    case ReportInventoryQuickFilterOptions.UNITNAME:
      return `Đơn vị `;
      case ReportInventoryQuickFilterOptions.TOTALCODE:
        return `Giá trị tồn `;
    default:
      return "";
  }
};

export const ReportInventoryDetailQuickFilterOptions = {
  AMOUTCHARGEINUNIT: "amountChargeInUnit",
  CREATEON: "createdOn",
  OBJECTID: "objectId",
  NAME: "name",
  CODE: "code",
  TYPE: "type",
  NOTE: "notes",
  STOCKREMAIN:"stockRemain"
};
export const getReportInventoryDetailQuickFilterLabel = (key: string) => {
  switch (key) {
    case ReportInventoryDetailQuickFilterOptions.CODE:
      return `Mã tham chiếu`;
    case ReportInventoryDetailQuickFilterOptions.AMOUTCHARGEINUNIT:
      return `Số lượng thay đổi`;
    case ReportInventoryDetailQuickFilterOptions.TYPE:
      return `Loại chứng từ`;
    case ReportInventoryDetailQuickFilterOptions.CREATEON:
      return `Thời gian`;
    case ReportInventoryDetailQuickFilterOptions.NOTE:
      return `ghi chú`;
      case ReportInventoryDetailQuickFilterOptions.STOCKREMAIN:
        return `Tồn cuối`;
    default:
      return "";
  }
};

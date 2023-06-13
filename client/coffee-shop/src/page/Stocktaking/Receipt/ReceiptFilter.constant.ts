import i18next from "i18next";

const t = i18next.getFixedT(null, ["component", "accounts"]);
export const ReceiptQuickFilterOptions = {
  CODE: "code",
  NAME: "name",
  QUANTITY: "quantity",
  STATUS: "status",
  PRICE: "totalMoney",
  CREATED_ON: "createdOn",
  MODIFIED_ON: "modifieldOn",
  TYPE: "type",
};

export const getReceiptQuickFilterLabel = (key: string) => {
  switch (key) {
    case ReceiptQuickFilterOptions.CODE:
      return `Mã phiếu`;
    case ReceiptQuickFilterOptions.NAME:
      return `Tên phiếu`;
    case ReceiptQuickFilterOptions.QUANTITY:
      return `Số lượng`;
    case ReceiptQuickFilterOptions.STATUS:
      return `Trạng thái`;
    case ReceiptQuickFilterOptions.PRICE:
      return `Giá trị nhập`;
    case ReceiptQuickFilterOptions.TYPE:
      return `Loại phiếu`;
    case ReceiptQuickFilterOptions.CREATED_ON:
      return `Ngày tạo`;
    case ReceiptQuickFilterOptions.MODIFIED_ON:
      return `Ngày sửa`;
    default:
      return "";
  }
};

import i18next from "i18next";

const t = i18next.getFixedT(null, ["component", "accounts"]);
export const ItemsQuickFilterOptions = {
  CODE: "code",
  NAME: "name",
  STATUS: "status",
  UNIT: "unit",
  DISCOUNT: "discount",
  DESCRIPTION: "description",
  IMAGE_URL: "image_url",
  CREATED_ON: "createdOn",
  MODIFIED_ON: "modifieldOn",
};

export const getItemsQuickFilterLabel = (key: string) => {
  switch (key) {
    case ItemsQuickFilterOptions.CODE:
      return `Mã nguyên liệu`;
    case ItemsQuickFilterOptions.NAME:
      return `Tên nguyên liệu`;
    case ItemsQuickFilterOptions.DISCOUNT:
      return `Chiết khấu`;
    case ItemsQuickFilterOptions.STATUS:
      return `Trạng thái`;
    case ItemsQuickFilterOptions.DESCRIPTION:
      return `Mô tả`;
    case ItemsQuickFilterOptions.UNIT:
      return `Đơn vị`;
    case ItemsQuickFilterOptions.CREATED_ON:
      return `Ngày tạo`;
    case ItemsQuickFilterOptions.MODIFIED_ON:
      return `Ngày sửa`;
    case ItemsQuickFilterOptions.IMAGE_URL:
      return `Ảnh mặt hàng`;
    default:
      return "";
  }
};

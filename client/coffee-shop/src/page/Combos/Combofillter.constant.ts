import i18next from "i18next";

const t = i18next.getFixedT(null, ["component", "accounts"]);
export const CombosQuickFilterOptions = {
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

export const getCombosQuickFilterLabel = (key: string) => {
  switch (key) {
    case CombosQuickFilterOptions.CODE:
      return `Mã nguyên liệu`;
    case CombosQuickFilterOptions.NAME:
      return `Tên nguyên liệu`;
    case CombosQuickFilterOptions.DISCOUNT:
      return `Chiết khấu`;
    case CombosQuickFilterOptions.STATUS:
      return `Trạng thái`;
    case CombosQuickFilterOptions.DESCRIPTION:
      return `Mô tả`;
    case CombosQuickFilterOptions.CREATED_ON:
      return `Ngày tạo`;
    case CombosQuickFilterOptions.MODIFIED_ON:
      return `Ngày sửa`;
    case CombosQuickFilterOptions.IMAGE_URL:
      return `Ảnh mặt hàng`;
    default:
      return "";
  }
};

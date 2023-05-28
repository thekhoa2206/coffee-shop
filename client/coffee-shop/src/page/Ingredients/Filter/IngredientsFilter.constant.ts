import i18next from "i18next";

const t = i18next.getFixedT(null, ["component", "accounts"]);
export const IngredientsQuickFilterOptions = {
    CODE: "code",
    NAME: "name",
    QUANTITY: "quantity",
    STATUS: "status",
    PRICE: "price",
    UNIT: "đơn vị",
    CREATED_ON: "createdOn",
    MODIFIED_ON: "modifieldOn",
};

export const getIngredientsQuickFilterLabel = (key: string) => {
    switch (key) {
        case IngredientsQuickFilterOptions.CODE:
            return `Mã nguyên liệu`;
        case IngredientsQuickFilterOptions.NAME:
            return `Tên nguyên liệu`;
        case IngredientsQuickFilterOptions.QUANTITY:
            return `Số lượng`;
        case IngredientsQuickFilterOptions.STATUS:
            return `Trạng thái`;
        case IngredientsQuickFilterOptions.PRICE:
            return `Giá`;
        case IngredientsQuickFilterOptions.UNIT:
            return `Đơn vị`;
        case IngredientsQuickFilterOptions.CREATED_ON:
            return `Ngày tạo`;
        case IngredientsQuickFilterOptions.MODIFIED_ON:
            return `Ngày sửa`;
        default:
            return "";
    }
};

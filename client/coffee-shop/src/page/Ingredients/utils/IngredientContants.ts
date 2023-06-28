export const IngredientsStatus = {
    STOCKING:1,
    OUT_OF_STOCK: 2,
    DELETED: 3,
    getName: (quantity?: number) => {
        switch (quantity) {
            case IngredientsStatus.STOCKING:
                return `Còn hàng`;
            case IngredientsStatus.OUT_OF_STOCK:
                return `Sắp hết hàng`;
            case IngredientsStatus.DELETED:
                return `Hết hàng`;
            default:
                return "";
        }
    },
};

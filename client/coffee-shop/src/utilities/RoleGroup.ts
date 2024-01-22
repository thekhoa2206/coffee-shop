export type RoleGroup = {
    name?: string;
    code?: string;
    roleItem?: RoleItem[];
}
export type RoleItem = {
    itemName?: string;
    roleGroupCode?: string;
    permission?: string;
}
export const RolePermissionGroup = {
    ORDER: 'order',
    REPORT: 'report',
    CUSTOMER: 'customer',
    USER: 'user',
    PRODUCT: 'product',
    INGRADIENT: 'ingradient',
    INVENTORY: 'inventory',
    POS: 'pos',
    TABLE: 'table',
    getName: (name: string) => {
        switch (name) {
            case RolePermissionGroup.ORDER:
                return 'Quản lý đơn hàng';
            // case RolePermissionGroup.CUSTOMER:
            //     return 'Quản lý khách hàng';
            case RolePermissionGroup.USER:
                return 'Quản lý người dùng';
            case RolePermissionGroup.PRODUCT:
                return 'Quản lý sản phẩm';
            case RolePermissionGroup.INGRADIENT:
                return 'Quản lý nguyên liệu';
            case RolePermissionGroup.INVENTORY:
                return 'Quản lý xuất nhập kho';
            case RolePermissionGroup.REPORT:
                return 'Báo cáo thống kê';
            case RolePermissionGroup.POS:
                return 'Bán hàng';
            case RolePermissionGroup.TABLE:
                return 'Quản lý bàn';
            default:
                return "";
        }
    },
}

export const RolePermissions = [
    RolePermissionGroup.ORDER, 
    RolePermissionGroup.POS, 
    RolePermissionGroup.USER, 
    RolePermissionGroup.PRODUCT, 
    RolePermissionGroup.INGRADIENT, 
    RolePermissionGroup.INVENTORY, 
    RolePermissionGroup.REPORT, 
];
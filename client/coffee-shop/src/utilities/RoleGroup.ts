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
    getName: (name: string) => {
        switch (name) {
            case RolePermissionGroup.ORDER:
                return 'Quản lý đơn hàng';
            case RolePermissionGroup.CUSTOMER:
                return 'Quản lý khách hàng';
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
            default:
                return "";
        }
    },
}

export const RolePermissions = [
    RolePermissionGroup.ORDER, 
    RolePermissionGroup.CUSTOMER, 
    RolePermissionGroup.USER, 
    RolePermissionGroup.PRODUCT, 
    RolePermissionGroup.INGRADIENT, 
    RolePermissionGroup.INVENTORY, 
    RolePermissionGroup.REPORT, 
];
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
    SHIPMENT: 'SHIPMENT',
    STOCK_TRANFER: 'STOCK_TRANFER',
    PARTNER: 'PARTNER',
    ACCOUNT: 'ACCOUNT',
    getName: (status: string) => {
        switch (status) {
        case RolePermissionGroup.SHIPMENT:
            return 'Vận đơn';
        case RolePermissionGroup.STOCK_TRANFER:
            return 'Chuyển hàng';
        case RolePermissionGroup.PARTNER:
            return 'Khách hàng';
        case RolePermissionGroup.ACCOUNT:
            return 'Nhân viên';
          default:
            return "";
        }
      },
}
export const RolePermission = {
    READ_SHIPMENTS: 'read_shipments',
    UPDATE_SHIPMENTS: 'update_shipments',
    CREATE_SHIPMENTS: 'create_shipments',
    DELETE_SHIPMENTS: 'delete_shipments',
    READ_STOCK_TRANFER: 'read_stock_tranfer',
    UPDATE_STOCK_TRANFER: 'update_stock_tranfer',
    CREATE_STOCK_TRANFER: 'create_stock_tranfer',
    DELETE_STOCK_TRANFER: 'delete_stock_tranfer',
    READ_PARTNER: 'read_partner',
    CREATE_PARTNER: 'create_partner',
    UPDATE_PARTNER: 'update_partner',
    DELETE_PARTNER: 'delete_partner',
    READ_ACCOUNT: 'read_account',
    UPDATE_ACCOUNT: 'update_account',
    CREATE_ACCOUNT: 'create_account',
    DELETE_ACCOUNT: 'delete_account',
    getName: (status: string) => {
        switch (status) {
        case RolePermission.READ_SHIPMENTS:
            return 'Xem vận đơn';
        case RolePermission.UPDATE_SHIPMENTS:
            return 'Cập nhật vận đơn';
        case RolePermission.CREATE_SHIPMENTS:
            return 'Tạo vận đơn';
        case RolePermission.DELETE_SHIPMENTS:
            return 'Xóa vận đơn';
        case RolePermission.READ_STOCK_TRANFER:
            return 'Xem phiếu chuyển hàng';
        case RolePermission.UPDATE_STOCK_TRANFER:
            return 'Cập nhật phiếu chuyển hàng';
        case RolePermission.CREATE_STOCK_TRANFER:
            return 'Tạo phiếu chuyển hàng';
        case RolePermission.DELETE_STOCK_TRANFER:
            return 'Xóa phiếu chuyển hàng';
        case RolePermission.READ_PARTNER:
            return 'Xem khách hàng';
        case RolePermission.UPDATE_PARTNER:
            return 'Cập nhật khách hàng';
        case RolePermission.CREATE_PARTNER:
            return 'Tạo khách hàng';
        case RolePermission.DELETE_PARTNER:
            return 'Xóa khách hàng';
        case RolePermission.READ_ACCOUNT:
            return 'Xem nhân viên';
        case RolePermission.UPDATE_ACCOUNT:
            return 'Cập nhật nhân viên';
        case RolePermission.CREATE_ACCOUNT:
            return 'Tạo nhân viên';
        case RolePermission.DELETE_ACCOUNT:
            return 'Xóa nhân viên';
          default:
            return "";
        }
      },
}

export const RoleGroups = () => {
    const roleGroups: RoleGroup[] 
    =  [
        {
            code: RolePermissionGroup.ACCOUNT,
            name: RolePermissionGroup.getName(RolePermissionGroup.ACCOUNT),
            roleItem: [
                {
                    permission: RolePermission.READ_ACCOUNT,
                    itemName: RolePermission.getName(RolePermission.READ_ACCOUNT),
                    roleGroupCode: RolePermissionGroup.ACCOUNT,
                },
                {
                    permission: RolePermission.CREATE_ACCOUNT,
                    itemName: RolePermission.getName(RolePermission.CREATE_ACCOUNT),
                    roleGroupCode: RolePermissionGroup.ACCOUNT,
                },
                {
                    permission: RolePermission.UPDATE_ACCOUNT,
                    itemName: RolePermission.getName(RolePermission.UPDATE_ACCOUNT),
                    roleGroupCode: RolePermissionGroup.ACCOUNT,
                },
                {
                    permission: RolePermission.DELETE_ACCOUNT,
                    itemName: RolePermission.getName(RolePermission.DELETE_ACCOUNT),
                    roleGroupCode: RolePermissionGroup.ACCOUNT,
                }
            ]
        },
        {
            code: RolePermissionGroup.SHIPMENT,
            name: RolePermissionGroup.getName(RolePermissionGroup.SHIPMENT),
            roleItem: [
                {
                    permission: RolePermission.READ_SHIPMENTS,
                    itemName: RolePermission.getName(RolePermission.READ_SHIPMENTS),
                    roleGroupCode: RolePermissionGroup.SHIPMENT,
                },
                {
                    permission: RolePermission.CREATE_SHIPMENTS,
                    itemName: RolePermission.getName(RolePermission.CREATE_SHIPMENTS),
                    roleGroupCode: RolePermissionGroup.SHIPMENT,
                },
                {
                    permission: RolePermission.UPDATE_SHIPMENTS,
                    itemName: RolePermission.getName(RolePermission.UPDATE_SHIPMENTS),
                    roleGroupCode: RolePermissionGroup.SHIPMENT,
                },
                {
                    permission: RolePermission.DELETE_SHIPMENTS,
                    itemName: RolePermission.getName(RolePermission.DELETE_SHIPMENTS),
                    roleGroupCode: RolePermissionGroup.SHIPMENT,
                }
            ]
        },
        {
            code: RolePermissionGroup.STOCK_TRANFER,
            name: RolePermissionGroup.getName(RolePermissionGroup.STOCK_TRANFER),
            roleItem: [
                {
                    permission: RolePermission.READ_STOCK_TRANFER,
                    itemName: RolePermission.getName(RolePermission.READ_STOCK_TRANFER),
                    roleGroupCode: RolePermissionGroup.STOCK_TRANFER,
                },
                {
                    permission: RolePermission.CREATE_STOCK_TRANFER,
                    itemName: RolePermission.getName(RolePermission.CREATE_STOCK_TRANFER),
                    roleGroupCode: RolePermissionGroup.STOCK_TRANFER,
                },
                {
                    permission: RolePermission.UPDATE_STOCK_TRANFER,
                    itemName: RolePermission.getName(RolePermission.UPDATE_STOCK_TRANFER),
                    roleGroupCode: RolePermissionGroup.STOCK_TRANFER,
                },
                {
                    permission: RolePermission.DELETE_STOCK_TRANFER,
                    itemName: RolePermission.getName(RolePermission.DELETE_STOCK_TRANFER),
                    roleGroupCode: RolePermissionGroup.STOCK_TRANFER,
                }
            ]
        },
        {
            code: RolePermissionGroup.PARTNER,
            name: RolePermissionGroup.getName(RolePermissionGroup.PARTNER),
            roleItem: [
                {
                    permission: RolePermission.READ_PARTNER,
                    itemName: RolePermission.getName(RolePermission.READ_PARTNER),
                    roleGroupCode: RolePermissionGroup.PARTNER,
                },
                {
                    permission: RolePermission.CREATE_PARTNER,
                    itemName: RolePermission.getName(RolePermission.CREATE_PARTNER),
                    roleGroupCode: RolePermissionGroup.PARTNER,
                },
                {
                    permission: RolePermission.UPDATE_PARTNER,
                    itemName: RolePermission.getName(RolePermission.UPDATE_PARTNER),
                    roleGroupCode: RolePermissionGroup.PARTNER,
                },
                {
                    permission: RolePermission.DELETE_PARTNER,
                    itemName: RolePermission.getName(RolePermission.DELETE_PARTNER),
                    roleGroupCode: RolePermissionGroup.PARTNER,
                }
            ]
        }
    ];
    return roleGroups;
}
import { ColumnsGroupV2 } from "components/SettingColumnsV2/SettingColumnsV2";



export const OrderSettingColumns: Record<string, boolean> = {
    code:  true,
    fee:  false,
    cod:  false,
    total:  true,
    status:  true,
    shipStatus:  true,
    paymentStatus:  true,
    createdOn:  false,
    modifiedOn:  false,
    phoneCustomer: true,
    nameCustomer: true,
}
export const OrderColumnNames = (): Record<string, string> => {
    return {
        code:  "Mã đơn hàng",
        fee:  "Phí",
        cod:  "Cod thu hộ",
        total:  "Tổng tiền",
        status:  "Trạng thái",
        shipStatus:  "Tài xế",
        paymentStatus:  "Thanh toán",
        createdOn:  "Ngày tạo",
        modifiedOn:  "Ngày cập nhật",
        phoneCustomer: "SĐT khách",
        nameCustomer: "Tên khách",
    }
}

export const getOrderColumnsGroup = (): ColumnsGroupV2[] => {
    return [
      {
        name: "",
        items: Object.keys(OrderColumnNames()).map((key) => ({
          name: key,
          label: (OrderColumnNames() as any)[key] as string,
          disable: key === "code",
          defaultSelected: OrderSettingColumns[key],
        })),
      },
    ];
  };
  
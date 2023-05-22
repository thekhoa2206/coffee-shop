export const DeliveryServiceProviderType = {
  EMPLOYEE: "employee",
  EXTERNAL_SERVICE: "external_service",
  EXTERNAL_SHIPPER: "external_shipper",
  ECOMMERCE: "ecommerce",
  getName: (code: string) => {
    switch (code) {
      case DeliveryServiceProviderType.EXTERNAL_SHIPPER:
      case DeliveryServiceProviderType.EMPLOYEE:
        return "Tự gọi shipper";
      case DeliveryServiceProviderType.EXTERNAL_SERVICE:
        return "Đẩy qua hãng vận chuyển";
      case DeliveryServiceProviderType.ECOMMERCE:
        return "Đối tác vận chuyển sàn thương mại điện tử";
      default:
        return code;
    }
  },
  getNameByType: (code: string) => {
    switch (code) {
      case DeliveryServiceProviderType.EXTERNAL_SHIPPER:
        return "Shipper cá nhân";
      case DeliveryServiceProviderType.EMPLOYEE:
        return "Shipper cửa hàng";
      case DeliveryServiceProviderType.EXTERNAL_SERVICE:
        return "Công ty";
      case DeliveryServiceProviderType.ECOMMERCE:
        return "Marketplace";
      default:
        return code;
    }
  },
};
export enum DeliveryServiceProviderTypes {
  EMPLOYEE = "employee",
  EXTERNAL_SERVICE = "external_service",
  EXTERNAL_SHIPPER = "external_shipper",
  ECOMMERCE = "ecommerce",
}

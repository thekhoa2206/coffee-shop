export const DeliveryProviderSystemCode = {
  GIAO_HANG_NHANH_2: "DSPGHN2",
  GHTK: "GHTK",
  VNPOST2: "VNPOST2",
  GRABEXPRESS: "GRABEXPRESS",
  AHAMOVE: "AHAMOVE",
  VIETTELPOST3: "DSPVTP3",
  SAPOEXPRESS: "SAPOEXPRESS",
  BEST_EXPRESS: "BEST_EXPRESS",
  NINJA_VAN: "NINJA_VAN",
  JNT_EXPRESS: "JNT_EXPRESS",
  NHAT_TIN_EXPRESS: "NHAT_TIN_EXPRESS",
  ZTO_EXPRESS: "ZTO_EXPRESS",
  getName: (code: string) => {
    switch (code) {
      case DeliveryProviderSystemCode.GIAO_HANG_NHANH_2:
        return "Giao hàng nhanh";
      case DeliveryProviderSystemCode.GHTK:
        return "Giao hàng tiết kiệm";
      case DeliveryProviderSystemCode.VNPOST2:
        return "VNPost";
      case DeliveryProviderSystemCode.GRABEXPRESS:
        return "Grab Express";
      case DeliveryProviderSystemCode.AHAMOVE:
        return "AhaMove";
      case DeliveryProviderSystemCode.VIETTELPOST3:
        return "ViettelPost";
      case DeliveryProviderSystemCode.SAPOEXPRESS:
        return "Sapo Express";
      case DeliveryProviderSystemCode.BEST_EXPRESS:
        return "BEST Express";
      case DeliveryProviderSystemCode.NINJA_VAN:
        return "Ninja Van";
      case DeliveryProviderSystemCode.JNT_EXPRESS:
        return "J&T Express";
      case DeliveryProviderSystemCode.NHAT_TIN_EXPRESS:
        return "Nhất Tín Express";
      case DeliveryProviderSystemCode.ZTO_EXPRESS:
        return "ZTO Express";
      default:
        return code;
    }
  },
};

export const LIST_CODES_PROVIDER = [
  DeliveryProviderSystemCode.SAPOEXPRESS,
  DeliveryProviderSystemCode.VIETTELPOST3,
  DeliveryProviderSystemCode.AHAMOVE,
  DeliveryProviderSystemCode.GRABEXPRESS,
  DeliveryProviderSystemCode.GIAO_HANG_NHANH_2,
  DeliveryProviderSystemCode.GHTK,
  DeliveryProviderSystemCode.VNPOST2,
  DeliveryProviderSystemCode.JNT_EXPRESS,
  DeliveryProviderSystemCode.NHAT_TIN_EXPRESS,
  DeliveryProviderSystemCode.BEST_EXPRESS,
  DeliveryProviderSystemCode.NINJA_VAN,
];

export const LIST_CODES_PROVIDER_SUPPORTING = [
  DeliveryProviderSystemCode.SAPOEXPRESS,
  DeliveryProviderSystemCode.VIETTELPOST3,
  DeliveryProviderSystemCode.AHAMOVE,
  DeliveryProviderSystemCode.GRABEXPRESS,
  DeliveryProviderSystemCode.GIAO_HANG_NHANH_2,
  DeliveryProviderSystemCode.GHTK,
  DeliveryProviderSystemCode.VNPOST2,
  DeliveryProviderSystemCode.JNT_EXPRESS,
  DeliveryProviderSystemCode.NHAT_TIN_EXPRESS,
  DeliveryProviderSystemCode.BEST_EXPRESS,
  DeliveryProviderSystemCode.NINJA_VAN,
  "Shopee", "Tiki", "Lazada", "Sendo", "Tiktok",
];

export const SERVICE_CODE_SUPPORTING = [
  "BEST_EXPRESS",
  "JNT_EXPRESS",
  "DSPGHN2",
  "VNPOST2",
  "SAPOEXPRESS",
  "GRABEXPRESS",
  "AHAMOVE",
  "DSPVTP3",
  "GHTK",
  "NINJA_VAN",
  "NHAT_TIN_EXPRESS",
  "ZTO_EXPRESS",
];

export enum ShipperCode {
  GIAO_HANG_NHANH = "DSPGHN",
  GIAO_HANG_NHANH_2 = "DSPGHN2",
  VIETTELPOST = "DSPVTP",
  VIETTELPOST2 = "DSPVTP2",
  SHIPCHUNG = "SHIPCHUNG",
  GHTK = "GHTK",
  VNPOST = "VNPOST",
  VNPOST2 = "VNPOST2",
  BOXME = "BOXME",
  GRABEXPRESS = "GRABEXPRESS",
  AHAMOVE = "AHAMOVE",
  VIETTELPOST3 = "DSPVTP3",
  SAPOEXPRESS = "SAPOEXPRESS",
  BEST_EXPRESS = "BEST_EXPRESS",
  JNT_EXPRESS = "JNT_EXPRESS",
  NINJA_VAN = "NINJA_VAN",
  DHL = "DHL_ECOMMERCE",
  NHAT_TIN = "NHAT_TIN_EXPRESS",
  ZTO_EXPRESS = "ZTO_EXPRESS",
}
export const GenderShipperCodes = [
  ShipperCode.SAPOEXPRESS,
  ShipperCode.GIAO_HANG_NHANH_2,
  ShipperCode.VIETTELPOST3,
  ShipperCode.GHTK,
  ShipperCode.VNPOST2,
  ShipperCode.AHAMOVE,
  ShipperCode.GRABEXPRESS,
  ShipperCode.BEST_EXPRESS,
  ShipperCode.NINJA_VAN,
  ShipperCode.NHAT_TIN,
  ShipperCode.JNT_EXPRESS,
  ShipperCode.ZTO_EXPRESS,
];

export const GetNameShippers = (code: string): string => {
  switch (code) {
    case ShipperCode.GIAO_HANG_NHANH_2:
      return `Giao hàng nhanh`;
    case ShipperCode.VIETTELPOST3:
      return `ViettelPost`;
    case ShipperCode.GHTK:
      return `Giao hàng tiết kiệm`;
    case ShipperCode.VNPOST2:
      return `VNPost`;
    case ShipperCode.AHAMOVE:
      return `AhaMove`;
    case ShipperCode.GRABEXPRESS:
      return `Grab Express`;
    case ShipperCode.BEST_EXPRESS:
      return `Best Express`;
    case ShipperCode.NINJA_VAN:
      return `Ninja Van`;
    case ShipperCode.NHAT_TIN:
      return `Nhất Tín Express`;
    case ShipperCode.JNT_EXPRESS:
      return `J&T Express`;
    case ShipperCode.ZTO_EXPRESS:
      return `ZTO Express`;
    case ShipperCode.SAPOEXPRESS:
      return "Sapo Express";
    default:
      return "";
  }
};

export enum ShipperLink {
  GHN_GUIDE_LINK = "https://support.sapo.vn/tich-hop-giao-hang-nhanh-pos#token-key-ghn",
  GHN_REGISTER_LINK = "https://sso.ghn.vn/register",
  GHN_SUPPORT_LINK = "https://support.sapo.vn/tich-hop-giao-hang-nhanh-pos",
  VTP_REGISTER_LINK = "https://id.viettelpost.vn/Account/Register?returnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3Dvtp.web%26secret%3Dvtp-web%26scope%3Dopenid%2520profile%2520se-public-api%2520offline_access%26response_type%3Did_token%2520token%26state%3Dabc%26redirect_uri%3Dhttps%253A%252F%252Fviettelpost.vn%252Fstart%252Flogin%26nonce%3Ddiaory163v7t5ige79p7f",
  VTP_SUPPORT_LINK = "https://support.sapo.vn/huong-dan-tich-hop-viettel-post",
  GHTK_GUIDE_LINK = "https://giaohangtietkiem.vn/dich-vu-giao-hang-ghtk",
  GHTK_REGISTER_LINK = "https://giaohangtietkiem.vn/",
  GHTK_SUPPORT_LINK = "https://support.sapo.vn/ket-noi-giao-hang-tiet-kiem",
  VNPOST2_SUPPORT_LINK = "https://support.sapo.vn/tich-hop-vietnam-post",
  AHAMOVE_SUPPORT_LINK = "https://support.sapo.vn/tich-hop-ahamove",
  GRAB_SUPPORT_LINK = "https://support.sapo.vn/tich-hop-grab-express",
  BEST_SUPPORT_LINK = "https://support.sapo.vn/best-express",
  NINJA_VAN_REGISTER_LINK = "https://www.giaohangninjavan.com",
  NINJA_VAN_SUPPORT_LINK = "https://support.sapo.vn/ket-noi-ninja-van",
  NHAT_TIN_REGISTER_LINK = "https://online.ntx.com.vn/register",
  NHAT_TIN_SUPPORT_LINK = "https://support.sapo.vn/nhat-tin-express",
  JNT_EXPRESS_REGISTER_LINK = "https://sellapp.jtexpress.vn/#/register",
  JNT_EXPRESS_SUPPORT_LINK = "https://support.sapo.vn/ket-noi-j-t-express",
  ZTO_EXPRESS_SUPPORT_LINK = "https://support.sapo.vn/zto-express",
}
/**
 * @return NOT_CONNECTED: chưa kết nối
 * @return CONNECTING: đang kết nối
 * @return DISCONNECT: không kết nối
 * @return EXPIRED: hết hạn kết nối
 */
export enum ConnectStatus {
  NOT_CONNECTED = 0,
  CONNECTING = 1,
  DISCONNECT = 2,
  EXPIRED = 3,
  LOCKED_CONNECTED = 4,
  LOCKED_DISCONNECT = 5,
}

export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
}
/**Loại gói hàng */
export const ZTOPackageType = [
  { value: "file", name: "Tài liệu" },
  { value: "items", name: "Hàng hóa" },
  { value: "mixing", name: "Tài liệu và hàng hóa" },
];
/**Hình thức thanh toán */
export const ZTOPayType = [
  { value: "send_pay", name: "Người gửi trả phí ngay" },
  { value: "monthly_statement", name: "Người gửi thanh toán cuối tháng" },
  { value: "by_pay", name: "Người nhận trả phí" },
];

export enum CookieDeliveryName {
  TOUR_GUIDE_DELIVERY = "tourDelivery",
}

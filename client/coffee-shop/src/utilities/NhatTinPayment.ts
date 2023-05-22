export const NhatTinPayment = {
  PAYMENT_METHOD_10: 10,
  PAYMENT_METHOD_11: 11,
  PAYMENT_METHOD_20: 20,
  getName: (code: number) => {
    switch (code) {
      case NhatTinPayment.PAYMENT_METHOD_10:
        return "Người gửi thanh toán ngay";
      case NhatTinPayment.PAYMENT_METHOD_11:
        return "Người gửi thanh toán sau";
      case NhatTinPayment.PAYMENT_METHOD_20:
        return "Người nhận thanh toán ngay";
      default:
        return code;
    }
  },
};

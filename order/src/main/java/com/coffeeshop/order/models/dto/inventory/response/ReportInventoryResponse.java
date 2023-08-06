package com.coffeeshop.order.models.dto.inventory.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class ReportInventoryResponse {
    private String ingredientName;
    private int ingredientId;
    //số lượng bắt đầu kỳ theo thời gian  khi xem report
    private int startAmount;
    //số lượng kết thúc kỳ theo thời gian khi xem report
    private int endAmount;
    // Số lượng bán
    private int amountDecrease;
    // Số lượng nhập
    private int amountIncrease;
    // Số lượng xuất
    private int amountPurchase;
    //đơn vị
    private String unitName;
    //tổng tiền
    private BigDecimal totalCode;

}

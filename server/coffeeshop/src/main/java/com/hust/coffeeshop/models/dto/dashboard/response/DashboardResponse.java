package com.hust.coffeeshop.models.dto.dashboard.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class DashboardResponse {
    //Số khách hàng
    private int customers;
    // Doanh thu
    private BigDecimal totalSale;
    // Tổng số đơn hàng
    private int orderCount;
    //Tổng số đơn hủy
    private int orderCancel;
    // trung bình mặt hàng trên hóa đơn
    private int averageItemQuantity;
    // trung bình doanh thu / hóa đơn
    private BigDecimal averageOrderValue;
   // Tiền hủy
    private BigDecimal cancelMoney;
    // Tổng doanh thu
    private BigDecimal totalRevenue;
    // tiền xuất kho
    private  BigDecimal exportMoney;
    // tiền nhập kho
    private BigDecimal importMoney;

}

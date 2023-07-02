package com.hust.coffeeshop.models.dto.reportOrder;

import com.hust.coffeeshop.models.dto.customer.CustomerResponse;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ReportCustomerResponse {
    private CustomerResponse customer;
    //Tổng số tiền đơn hàng
    private BigDecimal total;
    private BigDecimal totalDiscount;
    //Tổng số lượng đơn hàng
    private int quantity;
}

package com.hust.coffeeshop.models.dto.order;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class OrderRequest {
    private int id;
    private String code;
    private int customerId;
    private String note;
    private BigDecimal discountTotal;
    private List<OrderItemRequest> orderItemRequest;
    private BigDecimal total;
    private List<Integer> tableIds;
    private int status;
    private int paymentStatus;
}

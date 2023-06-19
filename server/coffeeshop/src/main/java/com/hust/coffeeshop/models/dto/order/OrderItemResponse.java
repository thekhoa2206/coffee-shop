package com.hust.coffeeshop.models.dto.order;

import com.hust.coffeeshop.models.dto.BaseResponse;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class OrderItemResponse extends BaseResponse {
    private int status;
    private boolean combo;
    private int quantity;
    private String name;
    private BigDecimal price;
    private int productId;
    private List<OrderItemComboResponse> orderItemComboResponses;
}

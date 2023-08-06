package com.coffeeshop.order.models.dto.order;

import com.coffeeshop.order.models.dto.BaseResponse;
import com.coffeeshop.order.models.dto.UserResponse;
import com.coffeeshop.order.models.dto.customer.CustomerResponse;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class OrderResponse extends BaseResponse {
    private String code;
    private CustomerResponse customerResponse;
    private int status;
    private BigDecimal total;
    private BigDecimal discountTotal;
    private UserResponse userResponse;
    private String note;
    private int paymentStatus;

    private List<OrderItemResponse> orderItemResponses;
}

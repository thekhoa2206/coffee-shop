package com.hust.coffeeshop.models.dto.order;

import com.hust.coffeeshop.models.dto.BaseResponse;
import com.hust.coffeeshop.models.dto.customer.CustomerResponse;
import com.hust.coffeeshop.models.dto.table.TableResponse;
import com.hust.coffeeshop.models.dto.user.UserResponse;
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
    private List<TableResponse> tableResponses;

    private List<OrderItemResponse> orderItemResponses;
}

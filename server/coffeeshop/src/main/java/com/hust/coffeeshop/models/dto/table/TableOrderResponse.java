package com.hust.coffeeshop.models.dto.table;

import com.hust.coffeeshop.models.dto.order.OrderResponse;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TableOrderResponse {
    private TableResponse table;
    private List<OrderResponse> orders;
}

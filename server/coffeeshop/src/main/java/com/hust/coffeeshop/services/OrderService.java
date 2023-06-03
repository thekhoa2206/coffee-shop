package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.order.OrderFilterRequest;
import com.hust.coffeeshop.models.dto.order.OrderResponse;

public interface OrderService {
    //api filter
    PagingListResponse<OrderResponse> filter(OrderFilterRequest filter) ;
}

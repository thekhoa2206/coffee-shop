package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.order.*;
import freemarker.template.TemplateException;

import java.io.IOException;
import java.text.ParseException;

public interface OrderService {
    //api filter
    PagingListResponse<OrderResponse> filter(OrderFilterRequest filter) throws ParseException;

    //hàm create order
    OrderResponse create(OrderRequest orderRequest);

//    OrderResponse getById(int id);

    OrderResponse addPayment(int id);

    OrderResponse update(OrderRequest orderRequest, int id);

    OrderResponse updateStatus(int id, int status);
}

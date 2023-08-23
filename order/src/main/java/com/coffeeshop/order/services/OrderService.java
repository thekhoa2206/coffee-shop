package com.coffeeshop.order.services;

import com.coffeeshop.order.models.dto.PagingListResponse;
import com.coffeeshop.order.models.dto.order.*;
import freemarker.template.TemplateException;

import java.io.IOException;
import java.text.ParseException;

public interface OrderService {
    //api filter
    PagingListResponse<OrderResponse> filter(OrderFilterRequest filter) throws ParseException;

    OrderPrintForm getPrintForm(PrintOrderRequest printOrder) throws IOException, TemplateException;

    OrderResponse updateStatus(int id, int status);

    OrderResponse getById(int id);
    OrderResponse create(OrderRequest orderRequest);
}

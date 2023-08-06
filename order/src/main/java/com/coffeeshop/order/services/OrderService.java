package com.coffeeshop.order.services;

import com.coffeeshop.order.models.dto.PagingListResponse;
import com.coffeeshop.order.models.dto.order.OrderFilterRequest;
import com.coffeeshop.order.models.dto.order.OrderPrintForm;
import com.coffeeshop.order.models.dto.order.OrderResponse;
import com.coffeeshop.order.models.dto.order.PrintOrderRequest;
import freemarker.template.TemplateException;

import java.io.IOException;
import java.text.ParseException;

public interface OrderService {
    //api filter
    PagingListResponse<OrderResponse> filter(OrderFilterRequest filter) throws ParseException;

    OrderPrintForm getPrintForm(PrintOrderRequest printOrder) throws IOException, TemplateException;

    OrderResponse updateStatus(int id, int status);

    OrderResponse getById(int id);
}

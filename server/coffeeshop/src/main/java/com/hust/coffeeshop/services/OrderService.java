package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.order.*;
import com.hust.coffeeshop.models.entity.Order;
import freemarker.template.TemplateException;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

public interface OrderService {
    //api filter
    PagingListResponse<OrderResponse> filter(OrderFilterRequest filter) throws ParseException;

    //hàm create order
    OrderResponse create(OrderRequest orderRequest);

    OrderResponse getById(int id);

    OrderResponse addPayment(int id);

    OrderResponse update(OrderRequest orderRequest, int id);

    OrderResponse updateStatus(int id, int status);

    OrderPrintForm getPrintForm(PrintOrderRequest printOrder) throws IOException, TemplateException;

    OrderResponse mapperOrderResponse(Order order);

    void updateStatusItem(int orderId, String itemIds);

    void updateStatusOrder(int orderId, String itemIds);

    void splitOrder(int orderId, List<OrderRequest> requests);

    void joinOrder(int orderId, List<OrderRequest> requests);

}

package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.order.OrderFilterRequest;
import com.hust.coffeeshop.models.dto.table.*;

import java.text.ParseException;

public interface TableService {
    TableResponse create(TableRequest request) ;
    TableResponse getbyid(int id);
    TableResponse update(TableRequest request, int id) ;
    void delete(int id) ;
    PagingListResponse<TableResponse> filter(TableFilterRequest filter);
    void updateStatus(String ids, int status);

    PagingListResponse<TableOrderResponse> getOrdersByTable(TableFilterRequest filter);

    PagingListResponse<OrderTableResponse> getOrdersAndTables(OrderFilterRequest filter) throws ParseException;
}

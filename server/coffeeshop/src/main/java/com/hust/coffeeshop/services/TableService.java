package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.table.TableFilterRequest;
import com.hust.coffeeshop.models.dto.table.TableRequest;
import com.hust.coffeeshop.models.dto.table.TableResponse;

public interface TableService {
    TableResponse create(TableRequest request) ;

    TableResponse update(TableRequest request, int id) ;
    void delete(int id) ;
    PagingListResponse<TableResponse> filter(TableFilterRequest filter);
}

package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.customer.CustomerFilterRequest;
import com.hust.coffeeshop.models.dto.customer.CustomerRequest;
import com.hust.coffeeshop.models.dto.customer.CustomerResponse;
import org.springframework.stereotype.Service;

public interface CustomerService {
    //api tạo
    CustomerResponse create(CustomerRequest request);

    //api update
    CustomerResponse update(CustomerRequest request, int id);

    //api xóa
    void delete(int id);

    //api get id
    CustomerResponse getById(int id);

    //api filter
    PagingListResponse<CustomerResponse> filter(CustomerFilterRequest filter) ;
}

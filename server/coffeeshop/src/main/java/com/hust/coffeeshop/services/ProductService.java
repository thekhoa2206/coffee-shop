package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.product.ProductFilterRequest;
import com.hust.coffeeshop.models.dto.product.ProductResponse;

public interface ProductService {
    PagingListResponse<ProductResponse> filter(ProductFilterRequest filter);
}

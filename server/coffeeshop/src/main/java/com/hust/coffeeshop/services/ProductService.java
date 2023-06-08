package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.product.ProductFilterRequest;
import com.hust.coffeeshop.models.dto.product.ProductResponse;
import com.hust.coffeeshop.models.dto.variant.VariantAvailable;

import java.util.List;

public interface ProductService {
    PagingListResponse<ProductResponse> filter(ProductFilterRequest filter);
    List<VariantAvailable> getQuantityAvailableVariant(List<Integer> variantIds);
}

package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.order.OrderFilterRequest;
import com.hust.coffeeshop.models.dto.order.OrderResponse;
import com.hust.coffeeshop.models.dto.variant.VariantFilterRequest;
import com.hust.coffeeshop.models.dto.variant.response.VariantRepsone;

public interface VariantService {
    PagingListResponse<VariantRepsone> filter(VariantFilterRequest filter) ;
}

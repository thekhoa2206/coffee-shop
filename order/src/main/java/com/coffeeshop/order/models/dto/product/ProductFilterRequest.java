package com.coffeeshop.order.models.dto.product;

import com.coffeeshop.order.models.dto.PagingFilterRequest;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class ProductFilterRequest extends PagingFilterRequest {
    private List<Integer> ids;
    private String query;
    private String statuses;
    private boolean combo;
}

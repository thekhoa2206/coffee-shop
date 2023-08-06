package com.coffeeshop.order.models.dto.item.request;

import com.coffeeshop.order.models.dto.PagingFilterRequest;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ItemRequest extends PagingFilterRequest {
    private String query;
    private String statuses;
    private List<Integer> ids;
}

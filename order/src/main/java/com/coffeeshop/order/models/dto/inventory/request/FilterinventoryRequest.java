package com.coffeeshop.order.models.dto.inventory.request;

import com.coffeeshop.order.models.dto.PagingFilterRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FilterinventoryRequest extends PagingFilterRequest {
    private String startDate;
    private String endDate;
}

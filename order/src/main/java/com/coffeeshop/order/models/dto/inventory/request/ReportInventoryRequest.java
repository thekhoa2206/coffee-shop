package com.coffeeshop.order.models.dto.inventory.request;

import com.coffeeshop.order.models.dto.PagingFilterRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportInventoryRequest  extends PagingFilterRequest {
    private long startDate;
    private long endDate;
}

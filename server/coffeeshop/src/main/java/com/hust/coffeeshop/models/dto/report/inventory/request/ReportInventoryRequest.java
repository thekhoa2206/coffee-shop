package com.hust.coffeeshop.models.dto.report.inventory.request;

import com.hust.coffeeshop.models.dto.PagingFilterRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportInventoryRequest  extends PagingFilterRequest {
    private long startDate;
    private long endDate;
}

package com.hust.coffeeshop.models.dto.report.inventory.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportInventoryRequest {
    private long startDate;
    private long endDate;
}

package com.hust.coffeeshop.models.dto.reportOrder;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ReportRevenueResponse {
    private BigDecimal totalRevenue = BigDecimal.ZERO;
    private BigDecimal totalDiscount = BigDecimal.ZERO;
}

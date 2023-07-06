package com.hust.coffeeshop.models.dto.dashboard.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class AggregateRevenueResponse {
    private BigDecimal aggregateRevenue;
    private BigDecimal cancelMoney;
    private String date;
    private BigDecimal totlaMoney;
}

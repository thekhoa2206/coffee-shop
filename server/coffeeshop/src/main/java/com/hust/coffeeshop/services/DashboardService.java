package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.dashboard.request.DashboardRequest;
import com.hust.coffeeshop.models.dto.dashboard.response.AggregateRevenueResponse;
import com.hust.coffeeshop.models.dto.dashboard.response.DashboardResponse;

import java.text.ParseException;
import java.util.List;

public interface DashboardService {
    DashboardResponse filter(DashboardRequest request) throws ParseException;
    List<AggregateRevenueResponse> reportAggregateRevenue (DashboardRequest request) throws ParseException;
}

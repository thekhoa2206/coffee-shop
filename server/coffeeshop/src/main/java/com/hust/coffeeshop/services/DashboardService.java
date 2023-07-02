package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.dashboard.request.DashboardRequest;
import com.hust.coffeeshop.models.dto.dashboard.response.DashboardResponse;

import java.text.ParseException;

public interface DashboardService {
    DashboardResponse filter(DashboardRequest request) throws ParseException;
}

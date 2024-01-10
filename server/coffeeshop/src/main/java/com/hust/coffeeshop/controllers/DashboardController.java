package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.dashboard.request.DashboardRequest;
import com.hust.coffeeshop.models.dto.dashboard.response.AggregateRevenueResponse;
import com.hust.coffeeshop.models.dto.dashboard.response.DashboardResponse;
import com.hust.coffeeshop.models.dto.ingredient.IngredientFilterRequest;
import com.hust.coffeeshop.models.dto.ingredient.IngredientResponse;
import com.hust.coffeeshop.services.DashboardService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping(value = "/api/dashboard")
@CrossOrigin("http://localhost:3000")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    //APi báo cáo thông tin đơn hàng, xuất nhập kho, doanh thu và tổng giá trị hoàn huỷ của đơn hàng theo thời gian
    @GetMapping
    public DashboardResponse filter(DashboardRequest filter) throws ParseException {
        return dashboardService.filter(filter);
    }
    //Api báo cáo tổng hợp về doanh thu theo thời gian
    @GetMapping("/aggregateRevenue")
    public List<AggregateRevenueResponse> reportAggregateRevenue(DashboardRequest filter) throws ParseException {
        return dashboardService.reportAggregateRevenue(filter);
    }
}

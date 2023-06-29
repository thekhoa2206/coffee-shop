package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.reportOrder.*;
import com.hust.coffeeshop.services.ReportOrderService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping(value = "/api/reports/order")
@CrossOrigin("http://localhost:3000")
public class ReportOrderController {
    /*
    - Thông số sản phẩm bán hàng
	- Top sản phẩm bán chạy
	- Thống kê doanh thu đơn hàng
	- Thống kê top khách hàng
    * */
    private final ReportOrderService orderService;

    public ReportOrderController(ReportOrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/customers")
    public PagingListResponse<ReportCustomerResponse> reportTopCustomer(ReportFilterRequest filterRequest) throws ParseException {
        return orderService.reportTopCustomer(filterRequest);
    }

    @GetMapping("/revenues")
    public List<ReportRevenueResponse> reportRevenue(ReportFilterRequest filterRequest) throws ParseException {
        return orderService.reportRevenue(filterRequest);
    }

    @GetMapping("/products")
    public List<ReportProductResponse> reportTopProducts(ReportProductFilter filterRequest) throws ParseException {
        return orderService.reportTopProducts(filterRequest);
    }
}

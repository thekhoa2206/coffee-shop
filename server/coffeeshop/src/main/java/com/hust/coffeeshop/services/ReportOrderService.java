package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.report.inventory.request.ReportInventoryRequest;
import com.hust.coffeeshop.models.dto.reportOrder.*;

import java.text.ParseException;
import java.util.List;

public interface ReportOrderService {
    List<ReportProductResponse> reportTopProducts(ReportProductFilter filter) throws ParseException;
    List<ReportRevenueResponse> reportRevenue(ReportFilterRequest filterRequest) throws ParseException;

    public ReportOrderResponse reportSale(ReportInventoryRequest request);
    PagingListResponse<ReportCustomerResponse> reportTopCustomer(ReportFilterRequest filterRequest) throws ParseException;
}

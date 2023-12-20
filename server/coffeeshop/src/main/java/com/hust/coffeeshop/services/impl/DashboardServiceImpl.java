package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.models.dto.dashboard.request.DashboardRequest;
import com.hust.coffeeshop.models.dto.dashboard.response.AggregateRevenueResponse;
import com.hust.coffeeshop.models.dto.dashboard.response.DashboardResponse;
import com.hust.coffeeshop.models.dto.ingredient.IngredientResponse;
import com.hust.coffeeshop.models.dto.order.OrderFilterRequest;
import com.hust.coffeeshop.models.repository.IngredientRepository;
import com.hust.coffeeshop.models.repository.OrderRepository;
import com.hust.coffeeshop.models.repository.StocktakingRepository;
import com.hust.coffeeshop.services.DashboardService;
import com.hust.coffeeshop.services.IngredientService;
import com.hust.coffeeshop.services.OrderService;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.ParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {
    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private  final StocktakingRepository stocktakingRepository;

    private final IngredientRepository ingredientRepository;
    private final IngredientService ingredientService;

    private final ModelMapper mapper;

    public DashboardServiceImpl(OrderRepository orderRepository, OrderService orderService, StocktakingRepository stocktakingRepository, IngredientRepository ingredientRepository, IngredientService ingredientService, ModelMapper mapper) {
        this.orderRepository = orderRepository;
        this.orderService = orderService;
        this.stocktakingRepository = stocktakingRepository;
        this.ingredientRepository = ingredientRepository;
        this.ingredientService = ingredientService;
        this.mapper = mapper;
    }
    // Thông số trên Dashboard
    @Override
    public DashboardResponse filter(DashboardRequest request) throws ParseException {
        //Số khách hàng
         Integer customers = 0;
        // Doanh thu đơn hàng
         BigDecimal totalSale = BigDecimal.ZERO;
        // Tổng số đơn hàng
        int orderCount = 0;
        //Tổng số đơn hủy
        Integer orderCancel = 0;
        // trung bình mặt hàng trên hóa đơn
        Integer averageItemQuantity = 0;
        // trung bình doanh thu / hóa đơn
         BigDecimal averageOrderValue = BigDecimal.ZERO;
        // Tiền hủy
         BigDecimal cancelMoney= BigDecimal.ZERO;
        // Tổng doanh thu
          BigDecimal totalRevenue= BigDecimal.ZERO;
          //Tổng số mặt hàng
        Integer countItems = 0;
        //Tổng tiền nhập kho
        BigDecimal importMoney =  BigDecimal.ZERO;
        //Tổng tiền xuất kho
        BigDecimal exportMoney =  BigDecimal.ZERO;
        Long startDate= CommonCode.getMilliSeconds(request.getCreatedOnMin(),"yyyy-MM-dd'T'HH:mm:ss'Z'");
        Long endtDate= CommonCode.getMilliSeconds(request.getCreatedOnMax(),"yyyy-MM-dd'T'HH:mm:ss'Z'") +86400000;
        val importData = stocktakingRepository.stocktakingByDate(startDate,endtDate, "import");
        if(!importData.isEmpty()){
            BigDecimal  importMoneys = importData.stream()
                    .map(o->o.getTotalMoney())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            importMoney = importMoneys;
        }
        val exportData = stocktakingRepository.stocktakingByDate(startDate,endtDate, "export");
        if(!exportData.isEmpty()){
            BigDecimal  exportMoneys = exportData.stream()
                    .map(o->o.getTotalMoney())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            exportMoney = exportMoneys;
        }

        OrderFilterRequest filter = new OrderFilterRequest();
        filter.setCreatedOnMax(CommonCode.getStringDate(new Date( endtDate), "yyyy-MM-dd'T'HH:mm:ss'Z'"));
        filter.setCreatedOnMin(CommonCode.getStringDate(new Date( startDate), "yyyy-MM-dd'T'HH:mm:ss'Z'"));
        var results = orderService.filter(filter);
        if(results.getMetadata().getTotal() != 0){
            val orderItem = results.getData().stream()
                    .flatMap(o->o.getOrderItemResponses().stream()).collect(Collectors.toList());
            val item = orderItem.stream()
                    .filter(o -> o.getOrderItemComboResponses()== null)
                    .collect(Collectors.toList());
            val combo = orderItem.stream()
                    .filter(o -> o.getOrderItemComboResponses() != null)
                    .collect(Collectors.toList());
            Integer countItem = 0;
            Integer countItemCOmbo = 0;
            if(!item.isEmpty()){
            val countItemData = item.stream()
                    .map(o -> o.getId())
                    .collect(Collectors.toList());
            countItem=countItemData.size();
            }
            if(!combo.isEmpty()){
                val countItemCOmboData = combo.stream()
                        .map(o -> o.getId())
                        .collect(Collectors.toList());
                countItemCOmbo = countItemCOmboData.size();
            }

            countItems= countItem + countItemCOmbo;
        }

        filter.setStatuses("2,3,5");
        var resultOk = orderService.filter(filter);
        if(resultOk.getMetadata().getTotal() != 0)
        {
//            List<Integer> customer = resultOk.getData().stream()
//                    .map(o -> o.getCustomerResponse().getId())
//                    .collect(Collectors.toList());
//            Set<Integer> countCustomers = new HashSet<>(customer);
//            customers = countCustomers.size();
//            val orderCounts = resultOk.getData().stream()
//                    .map(o -> o.getCustomerResponse().getId())
//                    .collect(Collectors.toList());
//            orderCount = orderCounts.size();
            BigDecimal  totalSales = resultOk.getData().stream()
                    .map(o->o.getTotal())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            totalSale = totalSales;
        }
        filter.setStatuses("4");
        var resultCancel = orderService.filter(filter);
        if(resultCancel.getMetadata().getTotal() != 0){
            Integer orderCountCancel = resultCancel.getData().stream()
                    .mapToInt(o -> o.getId())
                    .sum();
            orderCancel = orderCountCancel;
            BigDecimal  totalSalesCancel = resultCancel.getData().stream()
                    .map(o->o.getTotal())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            cancelMoney = totalSalesCancel;
        }
        DashboardResponse response = new DashboardResponse();
        response.setCancelMoney(cancelMoney);
        response.setCustomers(customers);
        response.setTotalSale(totalSale);
        response.setOrderCancel(orderCancel);
        response.setOrderCount(orderCount);
        response.setTotalRevenue(totalSale.add(exportMoney));
        if(orderCount!=0){
        response.setAverageItemQuantity(countItems/orderCount);
        BigDecimal test = response.getTotalRevenue().divide(new BigDecimal(orderCount),2, RoundingMode.HALF_UP);
        response.setAverageOrderValue(test);
        }
        else
        {
            response.setAverageItemQuantity(0);
            response.setAverageOrderValue(BigDecimal.ZERO);
        }
        response.setExportMoney(exportMoney);
        response.setImportMoney(importMoney);

        var ingredients = ingredientRepository.filterLimitQuantity(100);
        if(!ingredients.isEmpty()){
            var ingredientResponses = ingredients.stream().map(i -> {
                return mapper.map(i, IngredientResponse.class);
            }).collect(Collectors.toList());
            response.setIngredients(ingredientResponses);
        }
        return response;
    }
    @Override
    public List<AggregateRevenueResponse> reportAggregateRevenue (DashboardRequest request) throws ParseException {
        OrderFilterRequest filter = new OrderFilterRequest();
        if(request.getCreatedOnMax() == null || request.getCreatedOnMin() == null){
            return new ArrayList<>(Arrays.asList(new AggregateRevenueResponse()));
        }
        List<AggregateRevenueResponse> responses = new ArrayList<>();
        Long startDate= CommonCode.getMilliSeconds(request.getCreatedOnMin(),"yyyy-MM-dd'T'HH:mm:ss'Z'");
        Long endtDate= CommonCode.getMilliSeconds(request.getCreatedOnMax(),"yyyy-MM-dd'T'HH:mm:ss'Z'");
        BigDecimal total = BigDecimal.ZERO;
        for (var i = startDate; i < endtDate; i += 86400000)
        {
            BigDecimal aggregateRevenue = BigDecimal.ZERO;
            BigDecimal cancelMoney = BigDecimal.ZERO;
            filter.setCreatedOnMax(CommonCode.getStringDate(new Date(i + 86400000), "yyyy-MM-dd'T'HH:mm:ss'Z'"));
            filter.setCreatedOnMin(CommonCode.getStringDate(new Date(i), "yyyy-MM-dd'T'HH:mm:ss'Z'"));
            filter.setStatuses("2,3,4,5");
            AggregateRevenueResponse response = new AggregateRevenueResponse();
            var result = orderService.filter(filter);
            //Đơn hàng thành công
//            Integer test = orderRepository.getSumTottalByDate(i,i+86400000);
//            aggregateRevenue= new BigDecimal(test);
            var order = result.getData().stream()
                    .filter(o -> o.getStatus()!=4)
                    .collect(Collectors.toList());
            if(order.size()>0 && order != null){
                for (val oderMoney : order){
                    aggregateRevenue = aggregateRevenue.add(oderMoney.getTotal()) ;
                }
            }
            var cancels =  result.getData().stream()
                    .filter(o -> o.getStatus()==4)
                    .collect(Collectors.toList());
            if(cancels.size()>0 && cancels != null){
                for (val cancel : cancels){
                    cancelMoney = cancelMoney.add(cancel.getTotal());

                }
            }
            val exports = stocktakingRepository.stocktakingByDate(i,i + 86400000, "export");
            if(exports.size()>0 && exports != null){
                for (val export : exports){
                    aggregateRevenue = aggregateRevenue.add(export.getTotalMoney());
                }
            }
            total =  total.add(aggregateRevenue);
            response.setCancelMoney(cancelMoney);
            response.setAggregateRevenue(aggregateRevenue);
            response.setDate(CommonCode.getStringDate(new Date(i), "yyyy-MM-dd'T'HH:mm:ss'Z'"));
            responses.add(response);
        }
        BigDecimal finals = total;
        return responses;
    }
}

package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.order.OrderFilterRequest;
import com.hust.coffeeshop.models.dto.report.inventory.request.ReportInventoryRequest;
import com.hust.coffeeshop.models.dto.reportOrder.*;
import com.hust.coffeeshop.models.entity.*;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.*;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportOrderServiceImpl implements ReportOrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ModelMapper mapper;
    private final OrderService orderService;
    private final CustomerService customerService;
    private final ProductService productService;
    private final VariantService variantService;
    private final ComboRepository comboRepository;
    private final ItemRepository itemRepository;
    private final ItemIngredientRepository itemIngredientRepository;
    private final ComboItemRepository comboItemRepository;

    private final OrderItemComboRepository orderItemComboRepository;
    private final VariantRepository variantRepository;
    private final IngredientRepository ingredientRepository;

    public ReportOrderServiceImpl(OrderRepository orderRepository, OrderItemRepository orderItemRepository, ModelMapper mapper, OrderService orderService, CustomerService customerService, ProductService productService, VariantService variantService, ComboRepository comboRepository, ItemRepository itemRepository, ItemIngredientRepository itemIngredientRepository, ComboItemRepository comboItemRepository, OrderItemComboRepository orderItemComboRepository, VariantRepository variantRepository, IngredientRepository ingredientRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.mapper = mapper;
        this.orderService = orderService;
        this.customerService = customerService;
        this.productService = productService;
        this.variantService = variantService;
        this.comboRepository = comboRepository;
        this.itemRepository = itemRepository;
        this.itemIngredientRepository = itemIngredientRepository;
        this.comboItemRepository = comboItemRepository;
        this.orderItemComboRepository = orderItemComboRepository;
        this.variantRepository = variantRepository;
        this.ingredientRepository = ingredientRepository;
    }

    //  - Thông số sản phẩm bán hàng

    //	- Top sản phẩm bán chạy
    @Override
    public List<ReportProductResponse> reportTopProducts(ReportProductFilter filterRequest) throws ParseException {
        OrderFilterRequest filter = new OrderFilterRequest();
        filter.setCreatedOnMax(filterRequest.getCreatedOnMax());
        filter.setCreatedOnMin(filterRequest.getCreatedOnMin());
        var result = orderService.filter(filter);
        Map<Integer, ReportProductResponse> responses = new HashMap<>();
        if (result.getMetadata().getTotal() != 0) {
            for (var order : result.getData()) {
                if (order.getOrderItemResponses() != null && order.getOrderItemResponses().size() > 0) {
                    for (var orderItem : order.getOrderItemResponses()) {
                        if (orderItem.isCombo() && orderItem.getOrderItemComboResponses() != null && orderItem.getOrderItemComboResponses().size() > 0) {
                            for (var variant: orderItem.getOrderItemComboResponses()) {
                               if(responses.get(variant.getVariantId()) == null){
                                   var response = setNewVariant(variant.getVariantId(), variant.getQuantity()*orderItem.getQuantity(), variant.getPrice());
                                   responses.put(variant.getVariantId(), response);
                               }else{
                                   var response = responses.get(variant.getVariantId());
                                   response.setTotalRevenue(response.getTotalRevenue().add(order.getTotal()));
                                   response.setTotalQuantity(response.getTotalQuantity() + orderItem.getQuantity()* variant.getQuantity());
                                   responses.replace(orderItem.getProductId(), response);
                               }
                            }
                        } else {
                            if (responses.get(orderItem.getProductId()) == null) {
                                var response = setNewVariant(orderItem.getProductId(), orderItem.getQuantity(), orderItem.getPrice());
                                responses.put(orderItem.getProductId(), response);
                            } else {
                                var response = responses.get(orderItem.getProductId());
                                response.setTotalRevenue(response.getTotalRevenue().add(order.getTotal()));
                                response.setTotalQuantity(response.getTotalQuantity() + orderItem.getQuantity());
                                responses.replace(orderItem.getProductId(), response);
                            }
                        }
                    }
                }
            }
        }
        List<ReportProductResponse> reportProductResponses = new ArrayList<>();
        if(responses.size() > 0){
            responses.forEach((k, v)-> {
                if(k != null && v != null){
                    reportProductResponses.add(v);
                }
            });
        }
        if(reportProductResponses.size() >0){

        }
        return reportProductResponses.subList(0, reportProductResponses.size() > filterRequest.getTop() ?  filterRequest.getTop() - 1 : reportProductResponses.size());
    }

    private ReportProductResponse setNewVariant(int variantId, int quantity, BigDecimal price){
        ReportProductResponse response = new ReportProductResponse();
        var variantResponse = variantService.getById(variantId);
        response.setVariant(variantResponse);
        response.setTotalRevenue(price.multiply(BigDecimal.valueOf(quantity)));
        response.setTotalQuantity(quantity);
        return response;
    }

    //	- Thống kê doanh thu đơn hàng
    @Override
    public List<ReportRevenueResponse> reportRevenue(ReportFilterRequest filterRequest) throws ParseException {
        OrderFilterRequest filter = new OrderFilterRequest();
        List<ReportRevenueResponse> reportRevenueResponses = new ArrayList<>();
        if(filterRequest.getCreatedOnMax() == null || filterRequest.getCreatedOnMin() == null){
            return new ArrayList<>(Arrays.asList(new ReportRevenueResponse()));
        }
        long createdOnMax = CommonCode.getMilliSeconds(filterRequest.getCreatedOnMax(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
        long createdOnMin = CommonCode.getMilliSeconds(filterRequest.getCreatedOnMin(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
        for (var i = createdOnMin; i < createdOnMax; i += 86400000) {
            filter.setCreatedOnMax(CommonCode.getStringDate(new Date(i + 86400000), "yyyy-MM-dd'T'HH:mm:ss'Z'"));
            filter.setCreatedOnMin(CommonCode.getStringDate(new Date(i), "yyyy-MM-dd'T'HH:mm:ss'Z'"));
            ReportRevenueResponse response = new ReportRevenueResponse();
            var result = orderService.filter(filter);
            if (result.getMetadata().getTotal() != 0) {
                for (var order : result.getData()) {
                    response.setTotalRevenue(response.getTotalRevenue().add(order.getTotal()));
                    response.setTotalDiscount(response.getTotalDiscount().add(order.getDiscountTotal()));
                }
            }
            response.setDate(CommonCode.getStringDate(new Date(i), "yyyy-MM-dd'T'HH:mm:ss'Z'"));
            reportRevenueResponses.add(response);
        }
        return reportRevenueResponses;
    }

    //	- Thống kê top khách hàng
    @Override
    public PagingListResponse<ReportCustomerResponse> reportTopCustomer(ReportFilterRequest filterRequest) throws ParseException {
        OrderFilterRequest filter = new OrderFilterRequest();
        filter.setCreatedOnMax(filterRequest.getCreatedOnMax());
        filter.setCreatedOnMin(filterRequest.getCreatedOnMin());

        var result = orderService.filter(filter);
        List<ReportCustomerResponse> reportCustomers = new ArrayList<>();
        if (result.getMetadata().getTotal() != 0) {
            for (var order : result.getData()) {
                if (reportCustomers.size() > 0) {
                    var customer = reportCustomers
                            .stream().filter(r -> r.getCustomer().getId() == order.getCustomerResponse().getId()).collect(Collectors.toList())
                            .stream().findFirst().orElse(null);
                    if (customer != null && customer.getCustomer() != null) {
                        customer.setQuantity(customer.getQuantity() + 1);
                        customer.setTotalDiscount(customer.getTotalDiscount().add(order.getDiscountTotal()));
                        customer.setTotal(customer.getTotal().add(order.getTotal()));
                        reportCustomers = reportCustomers
                                .stream().map(r -> {
                                    if (r.getCustomer().getId() == order.getCustomerResponse().getId()) {
                                        return customer;
                                    } else return r;
                                }).collect(Collectors.toList());


                    } else {
                        ReportCustomerResponse reportCustomer = new ReportCustomerResponse();
                        reportCustomer.setCustomer(order.getCustomerResponse());
                        reportCustomer.setQuantity(1);
                        reportCustomer.setTotal(order.getTotal());
                        reportCustomer.setTotalDiscount(order.getDiscountTotal());
                        reportCustomers.add(reportCustomer);
                    }
                } else {
                    ReportCustomerResponse reportCustomer = new ReportCustomerResponse();
                    reportCustomer.setCustomer(order.getCustomerResponse());
                    reportCustomer.setQuantity(1);
                    reportCustomer.setTotal(order.getTotal());
                    reportCustomer.setTotalDiscount(order.getDiscountTotal());
                    reportCustomers.add(reportCustomer);
                }
            }
        }
        return new PagingListResponse<>(
                reportCustomers,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), reportCustomers.size()));
    }

    @Override
    public ReportOrderResponse reportSale(ReportInventoryRequest request){
        var orders = orderRepository.getOrdersByCreatedDate(request.getStartDate(), request.getEndDate());
        ReportOrderResponse report = new  ReportOrderResponse();
        report.setQuantityOrder(BigDecimal.valueOf(orders.size()));
        var totalOrders = BigDecimal.ZERO;
        var totalOrderCancel = BigDecimal.ZERO;
        var totalIngredient = BigDecimal.ZERO;
        var totalIngredientCancel = BigDecimal.ZERO;
        for (var order: orders){
            totalOrders = totalOrders.add(order.getTotal());
            if(order.getStatus() == CommonStatus.OrderStatus.DELETED){
                totalOrderCancel = totalOrderCancel.add(order.getTotal());
                totalIngredient = getTotal(totalIngredientCancel, order);
            }
            totalIngredient = getTotal(totalIngredient, order);
        }
        return report;
    }

    private BigDecimal getTotal(BigDecimal totalIngredient, Order order) {
        var orderItems = orderItemRepository.findOrderItemByOrderId(order.getId());
        if(!orderItems.isEmpty()){
            for (var lineItem: orderItems) {
                var ingredients = getIngredientByLineItem(lineItem);
                for (var ingredient: ingredients) {
                    totalIngredient = totalIngredient.add(ingredient.getExportPrice().multiply(BigDecimal.valueOf(lineItem.getQuantity())));
                }
            }
        }
        return totalIngredient;
    }

    private List<Ingredient> getIngredientByLineItem(OrderItem item){
        List<Integer> ingredientIds = new ArrayList<>();
        if(item.isCombo()){
            var orderVariantCombo = orderItemComboRepository.findOrderItemComboByOrderItemId(item.getId());
            var productIngredients = itemIngredientRepository.findItemIngredientByVariantIds(orderVariantCombo.stream().map(OrderItemCombo::getVariantId).collect(Collectors.toList()));
            ingredientIds.addAll(productIngredients.stream().map(ItemIngredient::getIngredientId).collect(Collectors.toList()));
        } else{
            var variant = variantService.getById(item.getProductId());
            var productIngredients = itemIngredientRepository.findItemIngredientByVariantId(variant.getId());
            ingredientIds.addAll(productIngredients.stream().map(ItemIngredient::getIngredientId).collect(Collectors.toList()));
        }
        return ingredientRepository.findByIds(ingredientIds);
    }
}

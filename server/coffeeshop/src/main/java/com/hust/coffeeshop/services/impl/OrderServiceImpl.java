package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.order.OrderFilterRequest;
import com.hust.coffeeshop.models.dto.order.OrderItemResponse;
import com.hust.coffeeshop.models.dto.order.OrderResponse;
import com.hust.coffeeshop.models.entity.Order;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.CustomerService;
import com.hust.coffeeshop.services.OrderService;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final FilterRepository filterRepository;
    private final ModelMapper mapper;
    private final OrderItemRepository orderItemRepository;
    private final CustomerService customerService;

    public OrderServiceImpl(OrderRepository orderRepository, FilterRepository filterRepository, ModelMapper mapper, OrderItemRepository orderItemRepository, CustomerService customerService) {
        this.orderRepository = orderRepository;
        this.filterRepository = filterRepository;
        this.mapper = mapper;
        this.orderItemRepository = orderItemRepository;
        this.customerService = customerService;
    }

    @Override
    public PagingListResponse<OrderResponse> filter(OrderFilterRequest filter) {

        Pageable pageable = PageRequest.of(
                filter.getPage() - 1,
                filter.getLimit(),
                Sort.by(Sort.Direction.DESC, "id"));
        var filters = new ArrayList<Filter>();

        //id
        if (filter.getIds() != null) {
            Filter ids = Filter.builder()
                    .field("id")
                    .operator(QueryOperator.IN)
                    .values(filter.getIds().stream().map(Object::toString).collect(Collectors.toList()))
                    .build();
            filters.add(ids);
        }
        //query
        if (filter.getQuery() != null && !filter.getQuery().isEmpty()) {
            Filter query = Filter.builder()
                    .field("code")
                    .operator(QueryOperator.LIKE)
                    .value(filter.getQuery())
                    .build();
            filters.add(query);
        }
        //status
        if (filter.getStatuses() != null && !filter.getStatuses().isEmpty()) {
            Filter statuses = Filter.builder()
                    .field("status")
                    .operator(QueryOperator.IN)
                    .values(Arrays.asList(filter.getStatuses().split(",")))
                    .build();
            filters.add(statuses);
        }
        Page<Order> results;
        if (filters.size() > 0)
            results = orderRepository.findAll(filterRepository.getSpecificationFromFilters(filters), pageable);
        else results = orderRepository.findAll(pageable);
        List<OrderResponse> orderResponses = new ArrayList<>();
        for (val item : results.getContent()
        ) {
            var orderResponse = mapperOrderResponse(item);
            var customer = customerService.getById(item.getCustomerId());
            if(customer != null){
                orderResponse.setCustomerResponse(customer);
            }
            orderResponses.add(orderResponse);
        }

        return new PagingListResponse<>(
                orderResponses,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), results.getTotalElements()));
    }

    private OrderResponse mapperOrderResponse (Order order) {
        val orderResponse = mapper.map(order, OrderResponse.class);
        var orderItems = orderItemRepository.findOrderByOrderId(order.getId());
        List<OrderItemResponse> orderItemResponses = new ArrayList<>();
        for (var orderItem: orderItems) {
            var orderItemResponse = mapper.map(orderItem, OrderItemResponse.class);
            orderItemResponses.add(orderItemResponse);
        }
        orderResponse.setOrderItemResponses(orderItemResponses);
        return orderResponse;
    }
}


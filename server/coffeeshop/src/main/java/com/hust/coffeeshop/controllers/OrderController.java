package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.order.OrderFilterRequest;
import com.hust.coffeeshop.models.dto.order.OrderRequest;
import com.hust.coffeeshop.models.dto.order.OrderResponse;
import com.hust.coffeeshop.services.OrderService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/orders")
@CrossOrigin("http://localhost:3000")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    @GetMapping
    public PagingListResponse<OrderResponse> filter(OrderFilterRequest filter){
        return orderService.filter(filter);
    }

    @PostMapping
    public OrderResponse create(@RequestBody OrderRequest request){
        return orderService.create(request);
    }
}

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

    @GetMapping(value = "/{id}")
    public OrderResponse getById(@PathVariable("id") int id){
        return orderService.getById(id);
    }

    @PutMapping(value = "/{id}/payment")
    public OrderResponse addPayment(@PathVariable("id") int id){
        return orderService.addPayment(id);
    }

    @PutMapping(value = "/{id}")
    public OrderResponse update(@PathVariable("id") int id, @RequestBody OrderRequest request){
        return orderService.update(request, id);
    }
}

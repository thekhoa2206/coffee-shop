package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.order.*;
import com.hust.coffeeshop.models.exception.BaseException;
import com.hust.coffeeshop.services.OrderService;
import freemarker.template.TemplateException;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping(value = "/api/orders")
@CrossOrigin("http://localhost:3000")
public class OrderController extends BaseException {
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

    @PutMapping(value = "/{id}/update_status/{status}")
    public OrderResponse updateStatus(@PathVariable("id") int id, @PathVariable("status") int status){
        return orderService.updateStatus(id, status);
    }


    @GetMapping(value = "/print_forms")
    public OrderPrintForm printForm(PrintOrderRequest input) throws TemplateException, IOException {
        return orderService.getPrintForm(input);
    }
}

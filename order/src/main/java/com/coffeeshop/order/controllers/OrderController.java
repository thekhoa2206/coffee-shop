package com.coffeeshop.order.controllers;

import com.coffeeshop.order.models.dto.PagingListResponse;
import com.coffeeshop.order.models.dto.order.OrderFilterRequest;
import com.coffeeshop.order.models.dto.order.OrderPrintForm;
import com.coffeeshop.order.models.dto.order.OrderResponse;
import com.coffeeshop.order.models.dto.order.PrintOrderRequest;
import com.coffeeshop.order.models.exception.BaseException;
import com.coffeeshop.order.services.OrderService;
import freemarker.template.TemplateException;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.ParseException;

@RestController
@RequestMapping(value = "/api/orders")
@CrossOrigin("http://localhost:3000")
public class OrderController extends BaseException {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public PagingListResponse<OrderResponse> filter(OrderFilterRequest filter) throws ParseException {
        return orderService.filter(filter);
    }

    @GetMapping(value = "/print_forms")
    public OrderPrintForm printForm(PrintOrderRequest input) throws TemplateException, IOException {
        return orderService.getPrintForm(input);
    }


//    @PutMapping(value = "/{id}/update_status/{status}")
//    public OrderResponse updateStatus(@PathVariable("id") int id, @PathVariable("status") int status){
//        return orderService.updateStatus(id, status);
//    }

    @GetMapping(value = "/{id}")
    public OrderResponse getById(@PathVariable("id") int id){
        return orderService.getById(id);
    }
}

package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.order.*;
import com.hust.coffeeshop.models.exception.BaseException;
import com.hust.coffeeshop.services.OrderService;
import freemarker.template.TemplateException;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping(value = "/api/orders")
@CrossOrigin("http://localhost:3000")
public class OrderController extends BaseException {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    //Api lọc danh sách đơn hàng
    @GetMapping
    public PagingListResponse<OrderResponse> filter(OrderFilterRequest filter) throws ParseException {
            return orderService.filter(filter);
    }
    //Api tạo mới đơn hàng
    @PostMapping
    public OrderResponse create(@RequestBody OrderRequest request){
        return orderService.create(request);
    }

    //Api lấy thông tin đơn hàng theo id
    @GetMapping(value = "/{id}")
    public OrderResponse getById(@PathVariable("id") int id){
        return orderService.getById(id);
    }

    //Api thanh toán đơn hàng
    @PutMapping(value = "/{id}/payment")
    public OrderResponse addPayment(@PathVariable("id") int id){
        return orderService.addPayment(id);
    }

    //Api cập nhật đơn hàng
    @PutMapping(value = "/{id}")
    public OrderResponse update(@PathVariable("id") int id, @RequestBody OrderRequest request){
        return orderService.update(request, id);
    }

    //Api cập nhật trạng thái
    @PutMapping(value = "/{id}/update_status/{status}")
    public OrderResponse updateStatus(@PathVariable("id") int id, @PathVariable("status") int status){
        return orderService.updateStatus(id, status);
    }

    //Api in thông tin đơn hàng
    @GetMapping(value = "/print_forms")
    public OrderPrintForm printForm(PrintOrderRequest input) throws TemplateException, IOException {
        return orderService.getPrintForm(input);
    }
    //Api cập nhật trạng thái của sản phẩm trong đơn hàng
    @PutMapping("/{id}/update_item/{item_ids}")
    public void updateStatusLineItem(@PathVariable("id") int id, @PathVariable("item_ids") String itemIds){
        orderService.updateStatusItem(id, itemIds);
        orderService.updateStatusOrder(id, itemIds);
    }

    //APi tách đơn hàng
    @PutMapping("/{id}/split_order")
    public void splitOrder(@PathVariable("id") int id, @RequestBody List<OrderRequest> requests){
        orderService.splitOrder(id, requests);
    }

    //APi gộp đơn hàng
    @PutMapping("/{id}/join_order")
    public void joinOrder(@PathVariable("id") int id, @RequestBody List<OrderRequest> requests){
        orderService.joinOrder(id, requests);
    }
}

package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.configuration.jwt.JwtProvider;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.order.*;
import com.hust.coffeeshop.models.entity.User;
import com.hust.coffeeshop.models.exception.BaseException;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.UserRepository;
import com.hust.coffeeshop.services.OrderService;
import com.hust.coffeeshop.services.UserService;
import freemarker.template.TemplateException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.text.ParseException;

@RestController
@RequestMapping(value = "/api/orders")
@CrossOrigin("http://localhost:3000")
public class OrderController extends BaseException {
    private final OrderService orderService;
    private final UserService userService;
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    public OrderController(OrderService orderService, UserService userService, JwtProvider jwtProvider, UserRepository userRepository) {
        this.orderService = orderService;
        this.userService = userService;
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
    }
    public User getuser(HttpServletRequest request){
        var jwt = request.getHeader("Authorization");
        if (jwt == null) throw new ErrorException("Jwt không được để trống!");
        var username = jwtProvider.getUserNameFromJwtToken(jwt);
        if (username == null) throw new ErrorException("Tài khoản không có thông tin!");
        var user = userRepository.findUserByUsername(username);
        if (user == null) throw new ErrorException("Người dùng không có thông tin!");

        return user;
    }
    @GetMapping
    public PagingListResponse<OrderResponse> filter(OrderFilterRequest filter) throws ParseException {
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
    public OrderResponse addPayment(@PathVariable("id") int id,HttpServletRequest request){
        var user =getuser(request);
        return orderService.addPayment(id,user.getId());
    }

    @PutMapping(value = "/{id}")
    public OrderResponse update(@PathVariable("id") int id, @RequestBody OrderRequest request){

        return orderService.update(request, id);
    }

    @PutMapping(value = "/{id}/update_status/{status}")
    public OrderResponse updateStatus(@PathVariable("id") int id, @PathVariable("status") int status,HttpServletRequest httpRequest){
        var user =getuser(httpRequest);
        return orderService.updateStatus(id, status,user.getId());
    }


    @GetMapping(value = "/print_forms")
    public OrderPrintForm printForm(PrintOrderRequest input) throws TemplateException, IOException {
        return orderService.getPrintForm(input);
    }
}

package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.customer.CustomerRequest;
import com.hust.coffeeshop.models.dto.customer.CustomerResponse;
import com.hust.coffeeshop.models.dto.user.request.CreateUserRequest;
import com.hust.coffeeshop.models.dto.user.response.UserResponse;
import com.hust.coffeeshop.models.exception.BaseException;
import com.hust.coffeeshop.models.exception.ErrorException;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hust.coffeeshop.services.UserService;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping(value = "/api/user")
@CrossOrigin("http://localhost:3000")
public class UserController extends BaseException {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/test")
    public String test(){
        if(1==1) throw new ErrorException("Lỗi rồi!");
        return "hello";
    }
    // tạo user mới
    @PostMapping
    public UserResponse create(@RequestBody CreateUserRequest request){
        return userService.create(request);
    }
}

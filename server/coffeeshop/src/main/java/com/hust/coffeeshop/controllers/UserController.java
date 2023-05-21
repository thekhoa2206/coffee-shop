package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.exception.BaseException;
import com.hust.coffeeshop.models.exception.ErrorException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController extends BaseException {
    @GetMapping("/test")
    public String test(){
        if(1==1) throw new ErrorException("Lỗi rồi!");
        return "hello";
    }
}

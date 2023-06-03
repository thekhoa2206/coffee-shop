package com.hust.coffeeshop.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/order")
@CrossOrigin("http://localhost:3000")
public class OrderController {
}

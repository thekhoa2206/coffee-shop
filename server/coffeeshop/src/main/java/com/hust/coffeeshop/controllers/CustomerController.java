package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.configuration.jwt.JwtProvider;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.customer.CustomerFilterRequest;
import com.hust.coffeeshop.models.dto.customer.CustomerRequest;
import com.hust.coffeeshop.models.dto.customer.CustomerResponse;
import com.hust.coffeeshop.models.repository.UserRepository;
import com.hust.coffeeshop.services.CustomerService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/customer")
public class CustomerController extends BaseController{
    private final CustomerService customerService;
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    public CustomerController(CustomerService customerService, UserRepository userRepository, JwtProvider jwtProvider) {
        super(userRepository, jwtProvider);
        this.customerService = customerService;
        this.userRepository = userRepository;
        this.jwtProvider = jwtProvider;
    }

    @GetMapping("/{id}")
    public CustomerResponse getById(@PathVariable("id") int id){
        return customerService.getById(id);
    }

    @GetMapping
    public PagingListResponse<CustomerResponse> filter(CustomerFilterRequest filter){
        return customerService.filter(filter);
    }

    @PostMapping
    public CustomerResponse create(@RequestBody  CustomerRequest request){
        return customerService.create(request);
    }
    @PutMapping("/{id}")
    public CustomerResponse update(@RequestBody CustomerRequest request, @PathVariable("id") int id){
        return customerService.update(request, id);
    }

    @DeleteMapping
    public void delete(@PathVariable("id") int id){
         customerService.delete(id);
    }
}

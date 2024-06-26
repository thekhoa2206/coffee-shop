package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.ingredient.IngredientFilterRequest;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitFilterRequest;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitRequest;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitResponse;
import com.hust.coffeeshop.models.dto.user.request.CreateUserRequest;
import com.hust.coffeeshop.models.dto.user.response.UserResponse;
import com.hust.coffeeshop.models.exception.BaseException;
import org.springframework.web.bind.annotation.CrossOrigin;
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

    // tạo user mới
    @PostMapping
    public UserResponse create(@RequestBody CreateUserRequest request){
        return userService.create(request);
    }
    @GetMapping("/{id}")
    public UserResponse getById(@PathVariable("id") int id){
        return userService.getById(id);
    }
    @PutMapping("/{id}")
    public UserResponse update(@RequestBody CreateUserRequest request, @PathVariable("id") int id){
        return userService.update(request, id);
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") int id){
        userService.deleteById(id);
    }
    @GetMapping
    public PagingListResponse<UserResponse> filter(IngredientFilterRequest filter){
        return userService.filterUser(filter);
    }
}

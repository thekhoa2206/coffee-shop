package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.customer.CustomerFilterRequest;
import com.hust.coffeeshop.models.dto.customer.CustomerRequest;
import com.hust.coffeeshop.models.dto.customer.CustomerResponse;
import com.hust.coffeeshop.models.dto.ingredient.IngredientFilterRequest;
import com.hust.coffeeshop.models.dto.ingredient.IngredientRequest;
import com.hust.coffeeshop.models.dto.ingredient.IngredientResponse;
import com.hust.coffeeshop.models.exception.BaseException;
import com.hust.coffeeshop.services.IngredientService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/ingredient")
@CrossOrigin("http://localhost:3000")
public class IngredientController extends BaseException {
    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    //Api lấy thông tin của nguyên liệu theo id
    @GetMapping("/{id}")
    public IngredientResponse getById(@PathVariable("id") int id){
        return ingredientService.getById(id);
    }

    //Api lọc danh sách nguyên liệu
    @GetMapping
    public PagingListResponse<IngredientResponse> filter(IngredientFilterRequest filter){
        return ingredientService.filter(filter);
    }

    //Api tạo mới nguyên liệu
    @PostMapping
    public IngredientResponse create(@RequestBody IngredientRequest request){
        return ingredientService.create(request);
    }
    //Api cập nhật nguyên liệu
    @PutMapping("/{id}")
    public IngredientResponse update(@RequestBody IngredientRequest request, @PathVariable("id") int id){
        return ingredientService.update(request, id);
    }

    //Api xoá nguyên liệu
    @DeleteMapping("/{id}")
    @CrossOrigin
    public void delete(@PathVariable("id") int id){
        ingredientService.delete(id);
    }


}

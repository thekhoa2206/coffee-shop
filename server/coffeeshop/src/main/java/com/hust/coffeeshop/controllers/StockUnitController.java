package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.ingredient.IngredientFilterRequest;
import com.hust.coffeeshop.models.dto.ingredient.IngredientRequest;
import com.hust.coffeeshop.models.dto.ingredient.IngredientResponse;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitFilterRequest;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitRequest;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitResponse;
import com.hust.coffeeshop.services.StockUnitService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/stock_unit")
@CrossOrigin("http://localhost:3000")
public class StockUnitController {
    private final StockUnitService stockUnitService;

    public StockUnitController(StockUnitService stockUnitService) {
        this.stockUnitService = stockUnitService;
    }

    //Api lấy thông tin đơn vị theo id
    @GetMapping("/{id}")
    public StockUnitResponse getById(@PathVariable("id") int id){
        return stockUnitService.getById(id);
    }
    //Api lọc danh sách đơn vị
    @GetMapping
    public PagingListResponse<StockUnitResponse> filter(StockUnitFilterRequest filter){
        return stockUnitService.filter(filter);
    }
    //Api tạo đơn vị
    @PostMapping
    public StockUnitResponse create(@RequestBody StockUnitRequest request){
        return stockUnitService.create(request);
    }
    //Api cập nhật đơn vi
    @PutMapping("/{id}")
    public StockUnitResponse update(@RequestBody StockUnitRequest request, @PathVariable("id") int id){
        return stockUnitService.update(request, id);
    }
    //Api xoá dđơn vị
    @DeleteMapping
    public void delete(@PathVariable("id") int id){
        stockUnitService.delete(id);
    }
}

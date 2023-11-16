package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.role.CreateRoleRequest;
import com.hust.coffeeshop.models.dto.role.RoleResponse;
import com.hust.coffeeshop.models.dto.shift.ShiftRequest;
import com.hust.coffeeshop.models.dto.shift.ShiftRespone;
import com.hust.coffeeshop.models.dto.stocktaking.repsone.StocktakingReponse;
import com.hust.coffeeshop.models.exception.BaseException;
import com.hust.coffeeshop.services.ShiftService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/shift")
@CrossOrigin("http://localhost:3000")
public class ShiftController extends BaseException {
    private final ShiftService shiftService;

    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    @PostMapping("/{id}")
    public ShiftRespone create(@PathVariable("id") int id) {
        return shiftService.create(id);
    }
    @GetMapping("/{id}")
    public ShiftRespone getById(@PathVariable("id") int id){
        return shiftService.getByUserId(id);
    }
}

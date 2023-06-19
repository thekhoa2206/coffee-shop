package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.item.request.ItemRequest;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;
import com.hust.coffeeshop.models.dto.role.CreateRoleRequest;
import com.hust.coffeeshop.models.dto.role.RoleResponse;
import com.hust.coffeeshop.models.exception.BaseException;
import com.hust.coffeeshop.services.RoleService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/role")
@CrossOrigin("http://localhost:3000")
public class RoleController extends BaseException {
    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }
    // tạo role mới
    @PostMapping
    public RoleResponse create(@RequestBody CreateRoleRequest request){
        return roleService.create(request);
    }
    @GetMapping
    public PagingListResponse<RoleResponse> filter(ItemRequest filter){
        return roleService.filter(filter);
    }
}

package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.role.CreateRoleRequest;
import com.hust.coffeeshop.models.dto.role.RoleResponse;
import com.hust.coffeeshop.models.exception.BaseException;
import com.hust.coffeeshop.services.RoleService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/role")
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
}

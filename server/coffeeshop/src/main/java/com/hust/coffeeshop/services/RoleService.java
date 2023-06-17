package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.item.request.ItemRequest;
import com.hust.coffeeshop.models.dto.role.CreateRoleRequest;
import com.hust.coffeeshop.models.dto.role.RoleResponse;
import com.hust.coffeeshop.models.dto.user.request.CreateUserRequest;
import com.hust.coffeeshop.models.dto.user.response.UserResponse;
import com.hust.coffeeshop.models.entity.Role;

public interface RoleService {
    //api tạo
    RoleResponse create (CreateRoleRequest request);
     Role getById(int id);
    PagingListResponse<RoleResponse> filter(ItemRequest filter);
}

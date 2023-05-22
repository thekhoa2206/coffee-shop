package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.user.request.CreateUserRequest;
import com.hust.coffeeshop.models.dto.user.response.UserResponse;


public interface UserService {
    //api tạo
    UserResponse create (CreateUserRequest request);
}

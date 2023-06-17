package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.ingredient.IngredientFilterRequest;
import com.hust.coffeeshop.models.dto.user.request.CreateUserRequest;
import com.hust.coffeeshop.models.dto.user.response.UserResponse;
import com.hust.coffeeshop.models.entity.User;
import org.springframework.data.domain.Page;


public interface UserService {
    //api tạo
    UserResponse create (CreateUserRequest request);
    UserResponse update(CreateUserRequest request,int id);
    UserResponse getById(int id);
    void deleteById(int id);
    PagingListResponse<UserResponse> filterUser(IngredientFilterRequest filter);
}

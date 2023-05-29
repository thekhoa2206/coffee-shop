package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.category.CategoryFilterRequest;
import com.hust.coffeeshop.models.dto.category.CategoryRequest;
import com.hust.coffeeshop.models.dto.category.CategoryResponse;

public interface CategoryService {
    //api tạo
    CategoryResponse create(CategoryRequest request);

    //api update
    CategoryResponse update(CategoryRequest request, int id);

    //api xóa
    void delete(int id);

    //api get id
    CategoryResponse getById(int id);

    //api filter
    PagingListResponse<CategoryResponse> filter(CategoryFilterRequest filter) ;
}

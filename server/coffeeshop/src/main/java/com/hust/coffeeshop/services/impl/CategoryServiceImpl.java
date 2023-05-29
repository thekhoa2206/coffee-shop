package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.category.CategoryFilterRequest;
import com.hust.coffeeshop.models.dto.category.CategoryRequest;
import com.hust.coffeeshop.models.dto.category.CategoryResponse;
import com.hust.coffeeshop.models.dto.customer.CustomerResponse;
import com.hust.coffeeshop.models.entity.Category;
import com.hust.coffeeshop.models.repository.CategoryRepository;
import com.hust.coffeeshop.models.repository.Filter;
import com.hust.coffeeshop.models.repository.FilterRepository;
import com.hust.coffeeshop.models.repository.QueryOperator;
import com.hust.coffeeshop.services.CategoryService;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final ModelMapper mapper;
    private final FilterRepository filterRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, ModelMapper mapper, FilterRepository filterRepository) {
        this.categoryRepository = categoryRepository;
        this.mapper = mapper;
        this.filterRepository = filterRepository;
    }

    @Override
    public CategoryResponse create(CategoryRequest request) {
        return null;
    }

    @Override
    public CategoryResponse update(CategoryRequest request, int id) {
        return null;
    }

    @Override
    public void delete(int id) {

    }

    @Override
    public CategoryResponse getById(int id) {
        return null;
    }

    @Override
    public PagingListResponse<CategoryResponse> filter(CategoryFilterRequest filter) {
        Pageable pageable = PageRequest.of(
                filter.getPage() - 1,
                filter.getLimit(),
                Sort.by(Sort.Direction.DESC, "id"));
        var filters = new ArrayList<Filter>();

        //id
        if (filter.getIds() != null) {
            Filter ids = Filter.builder()
                    .field("id")
                    .operator(QueryOperator.IN)
                    .values(filter.getIds().stream().map(Object::toString).collect(Collectors.toList()))
                    .build();
            filters.add(ids);
        }
        //query
        if (filter.getQuery() != null && !filter.getQuery().isEmpty()) {
            Filter query = Filter.builder()
                    .field("name")
                    .operator(QueryOperator.LIKE)
                    .value(filter.getQuery())
                    .build();
            filters.add(query);
        }
        //status
        if (filter.getStatuses() != null && !filter.getStatuses().isEmpty()) {
            Filter statuses = Filter.builder()
                    .field("status")
                    .operator(QueryOperator.IN)
                    .values(Arrays.asList(filter.getStatuses().split(",")))
                    .build();
            filters.add(statuses);
        }
        Page<Category> results;
        if (filters.size() > 0)
            results = categoryRepository.findAll(filterRepository.getSpecificationFromFilters(filters), pageable);
        else results = categoryRepository.findAll(pageable);
        List<CategoryResponse> categoryResponses = new ArrayList<>();
        for (val category : results.getContent()
        ) {
            val categoryResponse = mapper.map(category, CategoryResponse.class);
            categoryResponses.add(categoryResponse);
        }

        return new PagingListResponse<>(
                categoryResponses,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), results.getTotalElements()));
    }
}

package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.customer.CustomerResponse;
import com.hust.coffeeshop.models.dto.ingredient.IngredientFilterRequest;
import com.hust.coffeeshop.models.dto.ingredient.IngredientRequest;
import com.hust.coffeeshop.models.dto.ingredient.IngredientResponse;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitResponse;
import com.hust.coffeeshop.models.entity.Customer;
import com.hust.coffeeshop.models.entity.Ingredient;
import com.hust.coffeeshop.models.entity.StockUnit;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.IngredientService;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IngredientServiceImpl implements IngredientService {
    private final IngredientRepository ingredientRepository;
    private final ModelMapper mapper;
    private final FilterRepository filterRepository;
    private final StockUnitRepository stockUnitRepository;

    public IngredientServiceImpl(IngredientRepository ingredientRepository, ModelMapper mapper, FilterRepository filterRepository, StockUnitRepository stockUnitRepository) {
        this.ingredientRepository = ingredientRepository;
        this.mapper = mapper;
        this.filterRepository = filterRepository;
        this.stockUnitRepository = stockUnitRepository;
    }

    @Override
    public IngredientResponse create(IngredientRequest request) {
        if (request.getName() == null) throw new ErrorException("Tên nguyên liệu không được để trống");
        Ingredient ingredient = new Ingredient();
        ingredient.setName(request.getName());
        ingredient.setStatus(CommonStatus.IngredientStatus.ACTIVE);
        ingredient.setExportPrice(request.getExportPrice() != null ? request.getExportPrice() : BigDecimal.ZERO);
        ingredient.setCreatedOn();
        ingredient.setModifiedOn();
        ingredient.setQuantity(request.getQuantity());

        StockUnit stockUnit = new StockUnit();
        if (request.getStockUnitId() == 0) {
            stockUnit = stockUnitRepository.findById(request.getStockUnitId()).get();
        }

        ingredient.setStockUnitId(stockUnit.getId());
        ingredient = ingredientRepository.save(ingredient);

        var stockUnitResponse = mapper.map(stockUnit, StockUnitResponse.class);
        stockUnitResponse.set();
        var ingredientResponse = mapper.map(ingredient, IngredientResponse.class);
        ingredientResponse.set();
        ingredientResponse.setStockUnitResponse(stockUnitResponse);
        return ingredientResponse;
    }

    @Override
    public IngredientResponse update(IngredientRequest request, int id) {
        if (id == 0) throw new ErrorException("Không có thông tin nguyên liệu");
        var ingredient = ingredientRepository.findById(id).get();
        if (ingredient == null) throw new ErrorException("Không tìm thấy nguyên liệu");

        ingredient.setName(request.getName());
        ingredient.setExportPrice(request.getExportPrice());
        ingredient.setStockUnitId(request.getStockUnitId());
        ingredient.setModifiedOn();
        ingredient = ingredientRepository.save(ingredient);
        var ingredientResponse = mapper.map(ingredient, IngredientResponse.class);
        ingredientResponse.set();
        return ingredientResponse;
    }

    @Override
    public void delete(int id) {
        if (id == 0) throw new ErrorException("Không có thông tin nguyên liệu");
        var ingredient = ingredientRepository.findById(id).get();
        ingredient.setModifiedOn();
        ingredient.setStatus(CommonStatus.IngredientStatus.DELETED);
        ingredientRepository.save(ingredient);
    }


    @Override
    public IngredientResponse getById(int id) {
        if (id == 0) throw new ErrorException("Không có thông tin nguyên liệu");
        var ingredient = ingredientRepository.findById(id);
        var stockUnit = stockUnitRepository.findById(ingredient.get().getStockUnitId());
        if(ingredient.get() == null) throw new ErrorException("Không tìm thấy nguyên liệu");
        var ingredientResponse = mapper.map(ingredient, IngredientResponse.class);
        if(stockUnit.get() != null) {
            var stockUnitResponse = mapper.map(stockUnit, StockUnitResponse.class);
            ingredientResponse.setStockUnitResponse(stockUnitResponse);
        }
        ingredientResponse.set();
        return ingredientResponse;
    }

    @Override
    public PagingListResponse<IngredientResponse> filter(IngredientFilterRequest filter) {
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
        Page<Ingredient> results;
        if (filters.size() > 0)
            results = ingredientRepository.findAll(filterRepository.getSpecificationFromFilters(filters), pageable);
        else results = ingredientRepository.findAll(pageable);
        List<IngredientResponse> ingredientResponses = new ArrayList<>();
        for (val customer : results.getContent()
        ) {
            val ingredientResponse = mapper.map(customer, IngredientResponse.class);
            ingredientResponses.add(ingredientResponse);
        }

        return new PagingListResponse<>(
                ingredientResponses,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), results.getTotalElements()));
    }
}

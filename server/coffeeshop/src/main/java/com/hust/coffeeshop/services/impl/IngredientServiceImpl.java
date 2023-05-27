package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.ingredient.IngredientFilterRequest;
import com.hust.coffeeshop.models.dto.ingredient.IngredientRequest;
import com.hust.coffeeshop.models.dto.ingredient.IngredientResponse;
import com.hust.coffeeshop.models.entity.Ingredient;
import com.hust.coffeeshop.models.entity.StockUnit;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.FilterRepository;
import com.hust.coffeeshop.models.repository.IngredientRepository;
import com.hust.coffeeshop.models.repository.StockUnitRepository;
import com.hust.coffeeshop.services.IngredientService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

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
        if(request.getName() == null) throw new ErrorException("Tên nguyên liệu không được để trống");
        if(request.getStockUnit().getName() == null) throw new ErrorException("Tên đơn vị không được để trống");
        Ingredient ingredient = new Ingredient();
        ingredient.setName(request.getName());
        ingredient.setStatus(1);
        ingredient.setExportPrice(request.getExportPrice() != null ? request.getExportPrice() : BigDecimal.ZERO);
        ingredient.setCreatedOn();
        ingredient.setModifiedOn();
        ingredient.setQuantity(request.getQuantity());

        StockUnit stockUnit = new StockUnit();
        stockUnit.setStatus(1);
        stockUnit.setName(request.getStockUnit().getName());
        stockUnit.setModifiedOn();
        stockUnit.setCreatedOn();
        stockUnit = stockUnitRepository.save(stockUnit);

        ingredient.setStockUnitId(stockUnit.getId());
        ingredient = ingredientRepository.save(ingredient);

        var stockUnitResponse = mapper.map(ingredient, IngredientResponse.StockUnitResponse.class);
        var ingredientResponse = mapper.map(ingredient, IngredientResponse.class);
        ingredientResponse.setStockUnitResponse(stockUnitResponse);
        return ingredientResponse;
    }

    @Override
    public IngredientResponse update(IngredientRequest request, int id) {
        return null;
    }

    @Override
    public void delete(int id) {

    }

    @Override
    public IngredientResponse getById(int id) {
        return null;
    }

    @Override
    public PagingListResponse<IngredientResponse> filter(IngredientFilterRequest filter) {
        return null;
    }
}

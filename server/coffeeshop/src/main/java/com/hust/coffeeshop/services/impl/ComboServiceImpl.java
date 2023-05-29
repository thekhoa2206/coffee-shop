package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.models.dto.category.CategoryResponse;
import com.hust.coffeeshop.models.dto.combo.request.CreateComboRequest;
import com.hust.coffeeshop.models.dto.combo.response.ComboRespone;
import com.hust.coffeeshop.models.dto.ingredient.IngredientResponse;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitResponse;
import com.hust.coffeeshop.models.entity.Category;
import com.hust.coffeeshop.models.entity.Combo;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.CategoryRepository;
import com.hust.coffeeshop.models.repository.ComboRepository;
import com.hust.coffeeshop.services.ComboService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ComboServiceImpl implements ComboService {
    private final ComboRepository comboRepository;
    private final ModelMapper mapper;
    private final CategoryRepository categoryRepository;
    public ComboServiceImpl(ComboRepository comboRepository, ModelMapper mapper, CategoryRepository categoryRepository) {
        this.comboRepository = comboRepository;
        this.mapper = mapper;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public ComboRespone create(CreateComboRequest request) {
        if (request.getName() == null) throw new ErrorException("Tên combo không được để trống");
        Combo combo = new Combo();
        combo.setName(request.getName());
        combo.setStatus(CommonStatus.CustomerStatus.ACTIVE);
        combo.setPrice(request.getPrice() != null ? request.getPrice() : BigDecimal.ZERO);
        combo.setCreatedOn(CommonCode.getTimestamp());
        combo.setDescription(request.getDescription() );
        combo.setDiscountPercentage(request.getDiscountPercentage());

        combo.setCategoryId(request.getCategoryId());
        Category category = new Category();
        if (request.getCategoryId() != 0) {
            category = categoryRepository.findById(request.getCategoryId()).get();
        }
        var categoryResponse = mapper.map(category, CategoryResponse.class);
        comboRepository.save(combo);
        categoryResponse.set();
        var comboRespone = mapper.map(combo,ComboRespone.class);
        comboRespone.setCategory(category);
        return comboRespone;
    }
}

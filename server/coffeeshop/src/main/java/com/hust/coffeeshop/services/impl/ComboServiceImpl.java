package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.models.dto.category.CategoryResponse;
import com.hust.coffeeshop.models.dto.combo.request.CreateComboRequest;
import com.hust.coffeeshop.models.dto.combo.response.ComboRespone;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;
import com.hust.coffeeshop.models.dto.variant.response.VariantRepsone;
import com.hust.coffeeshop.models.entity.Category;
import com.hust.coffeeshop.models.entity.Combo;
import com.hust.coffeeshop.models.entity.ComboItem;
import com.hust.coffeeshop.models.entity.ItemIngredient;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.ComboService;
import com.hust.coffeeshop.services.ItemService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ComboServiceImpl implements ComboService {
    private final ComboRepository comboRepository;
    private final ModelMapper mapper;
    private final CategoryRepository categoryRepository;
    private final  VariantRepository variantRepository;
    private  final ItemRepository itemRepository;
    private  final ItemService itemService;
    private final ComboItemRepository comboItemRepository;

    public ComboServiceImpl(ComboRepository comboRepository, ModelMapper mapper, CategoryRepository categoryRepository, VariantRepository variantRepository, ItemRepository itemRepository, ItemService itemService, ComboItemRepository comboItemRepository) {
        this.comboRepository = comboRepository;
        this.mapper = mapper;
        this.categoryRepository = categoryRepository;
        this.variantRepository = variantRepository;
        this.itemRepository = itemRepository;
        this.itemService = itemService;
        this.comboItemRepository = comboItemRepository;
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
       var comboNew=  comboRepository.save(combo);
        Category category = new Category();
        if (request.getCategoryId() != 0)
        {
            category = categoryRepository.findById(request.getCategoryId()).get();
        }
        var comboRespone = mapper.map(combo,ComboRespone.class);
        List<ItemRepsone> itemRepsones = new ArrayList<>();
        if(request.getVarianIds().size()>0 )
        {
            for(var i : request.getVarianIds())
            {
              var variant = variantRepository.findById(i);
                ComboItem comboItem = new ComboItem();
                comboItem.setComboId(comboNew.getId());
                comboItem.setItemId(variant.get().getItemId());
                comboItem.setVariantId(variant.get().getId());
                comboItem.setCreatedOn(CommonCode.getTimestamp());
                var itemResponse =   itemService.getById(variant.get().getItemId());
                itemRepsones.add(itemResponse);
            }
        }
        var categoryResponse = mapper.map(category, CategoryResponse.class);
        categoryResponse.set();
        comboRespone.setCategory(category);
        comboRespone.setItems(itemRepsones);
        return comboRespone;
    }
    @Override
    public ComboRespone update(CreateComboRequest request,int id) {
        var combo = comboRepository.findById(id);
        if (combo == null) throw new ErrorException("không tìm thấy combo");
        if(request.getName() != null) combo.get().setName(request.getName());
        if(request.getDescription() !=null) combo.get().setDescription(request.getDescription());
        if(request.getDiscountPercentage() != null) combo.get().setDiscountPercentage(request.getDiscountPercentage());
        combo.get().setPrice( request.getPrice()  != null ? request.getPrice() :BigDecimal.ZERO) ;
        if( request.getImageUrl() != null) combo.get().setImageUrl(request.getImageUrl());
        combo.get().setModifiedOn(CommonCode.getTimestamp());
        combo.get().setCategoryId(request.getCategoryId());
        var comboNew=  comboRepository.save(combo.get());
        Category category = new Category();
        if (request.getCategoryId() != 0)
        {
            category = categoryRepository.findById(request.getCategoryId()).get();
        }

        var comboRespone = mapper.map(combo,ComboRespone.class);
        List<ItemRepsone> itemRepsones = new ArrayList<>();
        if(request.getVarianIds().size()>0 )
        {
            for(var i : request.getVarianIds())
            {
                List<ComboItem> comboItems = comboItemRepository.findUserByComboId(id);
                ComboItem comboItemFilter = comboItems.stream()
                        .filter((p) -> i.equals(p.getVariantId()))
                        .findAny()
                        .orElse(null);
                if(comboItemFilter != null){

                }
                var variant = variantRepository.findById(i);
                ComboItem comboItem = new ComboItem();
                comboItem.setComboId(comboNew.getId());
                comboItem.setItemId(variant.get().getItemId());
                comboItem.setVariantId(variant.get().getId());
                comboItem.setCreatedOn(CommonCode.getTimestamp());
                var itemResponse =   itemService.getById(variant.get().getItemId());
                itemRepsones.add(itemResponse);
            }
        }
        var categoryResponse = mapper.map(category, CategoryResponse.class);
        categoryResponse.set();
        comboRespone.setCategory(category);
        comboRespone.setItems(itemRepsones);
        return comboRespone;
    }
}

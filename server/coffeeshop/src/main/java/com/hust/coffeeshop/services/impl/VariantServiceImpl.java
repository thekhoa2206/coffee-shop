package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.item.response.IngredientItemResponse;
import com.hust.coffeeshop.models.dto.variant.VariantFilterRequest;
import com.hust.coffeeshop.models.dto.variant.response.VariantRepsone;
import com.hust.coffeeshop.models.entity.ComboItem;
import com.hust.coffeeshop.models.entity.Variant;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.IngredientService;
import com.hust.coffeeshop.services.ProductService;
import com.hust.coffeeshop.services.VariantService;
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
public class VariantServiceImpl implements VariantService {
    private final VariantRepository variantRepository;
    private final IngredientService ingredientService;
    private final ModelMapper mapper;
    private final FilterRepository filterRepository;
    private final ItemIngredientRepository itemIngredientRepository;
    private final ComboItemRepository comboItemRepository;
    private final ProductService productService;

    public VariantServiceImpl(VariantRepository variantRepository, IngredientService ingredientService, ModelMapper mapper, FilterRepository filterRepository, ItemIngredientRepository itemIngredientRepository, ComboItemRepository comboItemRepository, ProductService productService) {
        this.variantRepository = variantRepository;
        this.ingredientService = ingredientService;
        this.mapper = mapper;
        this.filterRepository = filterRepository;
        this.itemIngredientRepository = itemIngredientRepository;
        this.comboItemRepository = comboItemRepository;
        this.productService = productService;
    }

    @Override
    public PagingListResponse<VariantRepsone> filter(VariantFilterRequest filter) {
        Pageable pageable = PageRequest.of(
                filter.getPage() - 1,
                filter.getLimit(),
                Sort.by(Sort.Direction.DESC, "id"));
        var filters = new ArrayList<Filter>();
        //comboIds
        if (filter.getComboIds() != null) {
            var comboItems = comboItemRepository.findComboItemByComboIds(filter.getComboIds());
            if(comboItems != null && comboItems.size() > 0){
                var variantIds = comboItems.stream().map(ComboItem::getVariantId).collect(Collectors.toList());
                if(filter.getIds() != null){
                    filter.getIds().addAll(variantIds);
                }else{
                    filter.setIds(variantIds);
                }
            }

        }
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
        Page<Variant> results = null;
        List<VariantRepsone> variantRepsones = new ArrayList<>();
        try {
            if (filters.size() > 0)
                results = variantRepository.findAll(filterRepository.getSpecificationFromFilters(filters), pageable);
            else results = variantRepository.findAll(pageable);

            for (val item : results.getContent()) {
                var variantRespsone = mapperVariantResponse(item);
                variantRepsones.add(variantRespsone);
            }
        } catch (Exception e) {
            variantRepsones = new ArrayList<>();
        }
        return new PagingListResponse<>(
                variantRepsones,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), results != null ? results.getTotalElements() : 0));
    }
    @Override
    public VariantRepsone getById(int id){
        if(id == 0){
            throw new ErrorException("Id không được để trống!");
        }
        var variant = variantRepository.findById(id);
        if(!variant.isPresent()){
            throw new ErrorException("Không tìm thấy variant");
        }
        return mapperVariantResponse(variant.get());
    }

    private VariantRepsone mapperVariantResponse(Variant variant){
        var variantResponse = mapper.map(variant, VariantRepsone.class);
        List<Integer> variantIds = new ArrayList<>();
        variantIds.add(variant.getId());
        var variantAvailables = productService.getQuantityAvailableVariant(variantIds);
        var ingredientItems = itemIngredientRepository.findItemIngredientByVariantIds(variantIds);
        if(variantAvailables != null && variantAvailables.size() > 0){
            var available = variantAvailables.stream()
                    .filter(v -> v.getVariantId() == variant.getId())
                    .collect(Collectors.toList())
                    .stream().findFirst().orElse(null);
            variantResponse.setAvailable(available.getAvailable());
        }
        if(ingredientItems != null && ingredientItems.size() > 0){
            List<IngredientItemResponse> ingredientItemResponses = new ArrayList<>();
            for (var ingredientItem: ingredientItems) {
                var ingredientItemResponse = mapper.map(ingredientItem, IngredientItemResponse.class);
                ingredientItemResponses.add(ingredientItemResponse);
            }
            variantResponse.setIngredients(ingredientItemResponses);
        }
        return variantResponse;
    }
}

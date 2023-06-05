package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.product.ProductFilterRequest;
import com.hust.coffeeshop.models.dto.product.ProductResponse;
import com.hust.coffeeshop.models.dto.variant.VariantAvailable;
import com.hust.coffeeshop.models.entity.*;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.CategoryService;
import com.hust.coffeeshop.services.ComboService;
import com.hust.coffeeshop.services.ItemService;
import com.hust.coffeeshop.services.ProductService;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {
    private final ModelMapper mapper;
    private final FilterRepository filterRepository;
    private final ItemRepository itemRepository;
    private final ItemService itemService;
    private final ComboService comboService;
    private final ComboRepository comboRepository;
    private final CategoryService categoryService;
    private final ComboItemRepository comboItemRepository;
    private final VariantRepository variantRepository;
    private final IngredientRepository ingredientRepository;
    private final ItemIngredientRepository itemIngredientRepository;

    public ProductServiceImpl(ModelMapper mapper, FilterRepository filterRepository, ItemRepository itemRepository, ItemService itemService, ComboService comboService, ComboRepository comboRepository, CategoryService categoryService, ComboItemRepository comboItemRepository, VariantRepository variantRepository, IngredientRepository ingredientRepository, ItemIngredientRepository itemIngredientRepository) {
        this.mapper = mapper;
        this.filterRepository = filterRepository;
        this.itemRepository = itemRepository;
        this.itemService = itemService;
        this.comboService = comboService;
        this.comboRepository = comboRepository;
        this.categoryService = categoryService;
        this.comboItemRepository = comboItemRepository;
        this.variantRepository = variantRepository;
        this.ingredientRepository = ingredientRepository;
        this.itemIngredientRepository = itemIngredientRepository;
    }

    //hàm filter danh sách sản phẩm (combo, mặt hàng) ở trạng thái active có thể bán
    @Override
    public PagingListResponse<ProductResponse> filter(ProductFilterRequest filter) {
        List<ProductResponse> productResponses = new ArrayList<>();
        if (filter.getQuery() != null) {
            var query = "%" + filter.getQuery() + "%";
            List<Integer> statuses = new ArrayList<>();
            if(filter.getStatuses() != null){
                val statusArr = filter.getStatuses().split(",");
                for (var status: statusArr) {
                    if(status.equals("1")){
                        statuses.add(1);
                    }
                    if (status.equals("2"))
                        statuses.add(2);
                }
            }
            var combos = comboRepository.findComboByQuery(query, statuses);
            if (combos != null && combos.size() > 0) {
                for (var combo : combos) {
                    ProductResponse productResponse = mapperProductByCombo(combo);
                    productResponses.add(productResponse);
                }
            }
            var items = itemRepository.findItemByQuery(query, statuses);
            if(items != null && items.size() > 0){
                for (var item: items) {
                    ProductResponse productResponse = mapperProductByItem(item);
                    productResponses.add(productResponse);
                }
            }
        }
        productResponses.sort(((o1, o2) -> o1.getId() - o2.getId()));
        List<ProductResponse> products = new ArrayList<>();
        var indexLimit = filter.getLimit()*filter.getPage();

        if(indexLimit < productResponses.size()){
            for (int i = indexLimit - filter.getLimit(); i < indexLimit; i++ ) {
                products.add(productResponses.get(i));
            }
        }else {
            for (int i = indexLimit - filter.getLimit(); i < productResponses.size(); i++ ) {
                products.add(productResponses.get(i));
            }
        }
        return new PagingListResponse<>(
                products,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), productResponses != null ? productResponses.size() : 0));
    }

    private ProductResponse mapperProductByCombo(Combo combo) {
        var variantResponse = mapperProductVariants(combo.getId(), true);
        var category = categoryService.getById(combo.getCategoryId());
        var product = ProductResponse.builder()
                .combo(true)
                .description(combo.getDescription())
                .discountPercentage(combo.getDiscountPercentage())
                .imageUrl(combo.getImageUrl())
                .name(combo.getName())
                .price(combo.getPrice())
                .status(combo.getStatus())
                .variants(variantResponse)
                .categoryResponse(category)
                .build();
        product.setCreatedOn(combo.getCreatedOn());
        product.setModifiedOn(combo.getModifiedOn());
        product.setCreatedBy(combo.getCreatedBy());
        product.setModifiedBy(combo.getModifiedBy());
        product.setId(combo.getId());
        return product;
    }

    private List<ProductResponse.ProductVariantResponse> mapperProductVariants(int productId, boolean isCombo) {
        List<ProductResponse.ProductVariantResponse> productVariants = new ArrayList<>();
        //với sp combo
        if (isCombo) {
            var comboItems = comboItemRepository.findUserByComboId(productId);
            if (comboItems != null && comboItems.size() > 0) {
                List<Integer> variantIds = comboItems.stream().map(ComboItem::getVariantId).collect(Collectors.toList());
                var variants = variantRepository.findVariantByIds(variantIds);
                var variantAvailables = getQuantityAvailableVariant(variantIds);
                for (var variant : variants) {
                    var comboItem = comboItems.stream().filter(ci -> ci.getVariantId() == variant.getId()).collect(Collectors.toList()).stream().findFirst().orElse(null);
                    ProductResponse.ProductVariantResponse productVariant = new ProductResponse.ProductVariantResponse();
                    productVariant.setName(variant.getName());
                    productVariant.setPrice(variant.getPrice());
                    productVariant.setStatus(variant.getStatus());
                    productVariant.setProductItemId(comboItem.getId());
                    productVariant.setCreatedOn(variant.getCreatedOn());
                    productVariant.setModifiedOn(variant.getModifiedOn());
                    productVariant.setModifiedBy(variant.getModifiedBy());
                    productVariant.setCreatedBy(variant.getCreatedBy());
                    var productIngredients = mapperProductIngredients(variantIds);

                    //Số lượng có thể bán của variant
                    var variantAvailable = variantAvailables.stream().filter(v -> v.getVariantId() == variant.getId()).collect(Collectors.toList()).stream().findFirst().orElse(null);
                    productVariant.setAvailable(variantAvailable.getAvailable());
                    productVariant.setIngredients(productIngredients);
                    productVariants.add(productVariant);
                }
            }
        }
        return productVariants;
    }

    //Hàm mapper thông của mặt hàng
    private ProductResponse mapperProductByItem(Item item) {
        var variantResponse = mapperProductVariants(item.getId(), false);
        var category = categoryService.getById(item.getCategoryId());
        var product = ProductResponse.builder()
                .combo(true)
                .description(item.getDescription())
                .discountPercentage(item.getDiscountPercentage())
                .imageUrl(item.getImageUrl())
                .name(item.getName())
                .status(item.getStatus())
                .variants(variantResponse)
                .categoryResponse(category)
                .build();
        product.setCreatedOn(item.getCreatedOn());
        product.setModifiedOn(item.getModifiedOn());
        product.setCreatedBy(item.getCreatedBy());
        product.setModifiedBy(item.getModifiedBy());
        product.setId(item.getId());
        return product;
    }

    //Hàm mapper thông tin nguyên liệu của variant
    private List<ProductResponse.ProductIngredientResponse> mapperProductIngredients(List<Integer> variantIds) {
        List<ProductResponse.ProductIngredientResponse> productIngredients = new ArrayList<>();
        var itemIngredients = itemIngredientRepository.findItemIngredientByVariantIds(variantIds);
        List<Integer> itemIngredientIds = null;
        if (itemIngredients != null && itemIngredients.size() > 0)
            itemIngredientIds = itemIngredients.stream().map(ItemIngredient::getIngredientId).collect(Collectors.toList());
        List<Ingredient> ingredients = null;
        if (itemIngredientIds != null && itemIngredientIds.size() > 0)
            ingredients = ingredientRepository.findByIds(itemIngredientIds);
        if (ingredients != null && ingredients.size() > 0) {
            for (var itemIngredient : itemIngredients) {
                ProductResponse.ProductIngredientResponse productIngredient = new ProductResponse.ProductIngredientResponse();
                val ingredient = ingredients.stream().filter(i -> i.getId() == itemIngredient.getIngredientId()).collect(Collectors.toList()).stream().findFirst().orElse(null);
                if (ingredient != null) {
                    productIngredient.setQuantityInventory(ingredient.getQuantity());
                    productIngredient.setName(ingredient.getName());
                    productIngredient.setIngredientId(ingredient.getId());
                }
                productIngredient.setStatus(itemIngredient.getStatus());
                productIngredient.setAmountConsume(itemIngredient.getAmountConsume());
                productIngredient.setCreatedBy(itemIngredient.getCreatedBy());
                productIngredient.setCreatedOn(itemIngredient.getCreatedOn());
                productIngredient.setModifiedBy(itemIngredient.getModifiedBy());
                productIngredient.setModifiedOn(itemIngredient.getModifiedOn());
                productIngredient.setId(itemIngredient.getId());

                productIngredients.add(productIngredient);
            }
        }
        return productIngredients;
    }

    //Hàm tính số lượng có thể bán của variant
    public List<VariantAvailable> getQuantityAvailableVariant(List<Integer> variantIds) {
        List<VariantAvailable> variantAvailables = new ArrayList<>();
        List<ItemIngredient> itemIngredients = itemIngredientRepository.findItemIngredientByVariantIds(variantIds);
        List<Integer> itemIngredientIds = null;
        if (itemIngredients != null && itemIngredients.size() > 0)
            itemIngredientIds = itemIngredients.stream().map(ItemIngredient::getIngredientId).collect(Collectors.toList());
        List<Ingredient> ingredients = null;
        if (itemIngredientIds != null && itemIngredientIds.size() > 0)
            ingredients = ingredientRepository.findByIds(itemIngredientIds);
        for (var variantId : variantIds) {
            VariantAvailable variantAvailable = new VariantAvailable();
            var itemsByVariant = itemIngredients.stream()
                    .filter(i -> i.getVariantId() == variantId)
                    .collect(Collectors.toList());
            Ingredient ingredient = null;

            List<Integer> availableIngredients = new ArrayList<>();
            for (var item : itemsByVariant) {
                ingredient = ingredients.stream().
                        filter(i -> i.getId() == item.getIngredientId())
                        .collect(Collectors.toList())
                        .stream().findFirst()
                        .orElse(null);
                Integer availableIngredient = ingredient.getQuantity()/item.getAmountConsume();
                availableIngredients.add(availableIngredient);
            }
            Integer available = availableIngredients != null && availableIngredients.size() > 0 ? Collections.min(availableIngredients) : 0;
            variantAvailable.setVariantId(variantId);
            variantAvailable.setAvailable(available);
            variantAvailables.add(variantAvailable);
        }
        return variantAvailables;
    }
}

package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.category.CategoryResponse;
import com.hust.coffeeshop.models.dto.ingredient.IngredientCreateItemRequest;
import com.hust.coffeeshop.models.dto.item.request.CreateItemRequest;
import com.hust.coffeeshop.models.dto.item.request.ItemRequest;
import com.hust.coffeeshop.models.dto.item.response.IngredientItemResponse;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitResponse;
import com.hust.coffeeshop.models.dto.variant.request.CreateVariantRequest;
import com.hust.coffeeshop.models.dto.variant.response.VariantRepsone;
import com.hust.coffeeshop.models.entity.Item;
import com.hust.coffeeshop.models.entity.ItemIngredient;
import com.hust.coffeeshop.models.entity.StockUnit;
import com.hust.coffeeshop.models.entity.Variant;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.IngredientService;
import com.hust.coffeeshop.services.ItemService;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service

public class ItemServiceImpl implements ItemService {
    private final ItemRepository itemRepository;
    private final ModelMapper mapper;
    private final VariantRepository variantRepository;
    private final FilterRepository filterRepository;
    private final IngredientService ingredientService;
    private final StockUnitRepository stockUnitRepository;
    private final ItemIngredientRepository itemIngredientRepository;
    private final IngredientRepository ingredientRepository;
    private final CategoryRepository categoryRepository;

    public ItemServiceImpl(ItemRepository itemRepository, ModelMapper mapper, VariantRepository variantRepository, FilterRepository filterRepository, IngredientService ingredientService, StockUnitRepository stockUnitRepository, ItemIngredientRepository itemIngredientRepository, IngredientRepository ingredientRepository, CategoryRepository categoryRepository) {
        this.itemRepository = itemRepository;
        this.mapper = mapper;
        this.variantRepository = variantRepository;
        this.filterRepository = filterRepository;
        this.ingredientService = ingredientService;
        this.stockUnitRepository = stockUnitRepository;
        this.itemIngredientRepository = itemIngredientRepository;
        this.ingredientRepository = ingredientRepository;
        this.categoryRepository = categoryRepository;
    }

    //api tạo
    @Override
    @Transactional(rollbackOn = Exception.class)
    public ItemRepsone create(CreateItemRequest request) {
        if (request.getName() == null) throw new ErrorException("Tên mặt hàng không được để trống");
        Item item = mapper.map(request, Item.class);
        item.setStatus(CommonStatus.CustomerStatus.ACTIVE);
        item.setCreatedOn(CommonCode.getTimestamp());
        item.setModifiedOn();
        StockUnit stockUnit = new StockUnit();
        if (request.getStockUnitId() != 0) {
            stockUnit = stockUnitRepository.findById(request.getStockUnitId()).get();
        }
        var stockUnitResponse = mapper.map(stockUnit, StockUnitResponse.class);
        stockUnitResponse.set();
        ItemRepsone itemRepsone = null;


        List<VariantRepsone> variantRepsones = new ArrayList<>();
        try {
            var ItemNew = itemRepository.save(item);
            if (request.getVariantRequest() != null) {
                for (var i : request.getVariantRequest()) {
                    Variant variant = new Variant();
                    variant.setStatus(CommonStatus.VariantStatus.ACTIVE);
                    variant.setCreatedOn(CommonCode.getTimestamp());
                    variant.setModifiedOn();
                    variant.setPrice(i.getPrice());
                    variant.setName(item.getName() + " - " + i.getName());
                    variant.setItemId(ItemNew.getId());
                    VariantRepsone variantRepsone = mapper.map(request.getVariantRequest(), VariantRepsone.class);

                    try {
                        variant = variantRepository.save(variant);
                        List<IngredientItemResponse> ingredients = new ArrayList<>();
                        if (i.getIngredients().size() > 0) {
                            for (var ingredientRq : i.getIngredients()) {
                                var ingredient = ingredientService.getById(ingredientRq.getIngredientId());
                                if (ingredient == null) throw new ErrorException("khônh tìm thấy nguyên liệu");
                                ItemIngredient itemIngredient = new ItemIngredient();
                                itemIngredient.setItemId(ItemNew.getId());
                                itemIngredient.setIngredientId(ingredientRq.getIngredientId());
                                itemIngredient.setAmountConsume(ingredientRq.getAmountConsume());
                                itemIngredient.setCreatedOn();
                                itemIngredient.setModifiedOn();
                                itemIngredient.setVariantId(variant.getId());
                                itemIngredient.setStatus(CommonStatus.ItemIngredientStatus.ACTIVE);
                                itemIngredient = itemIngredientRepository.save(itemIngredient);
                                IngredientItemResponse ingredientItemResponse = mapper.map(itemIngredient, IngredientItemResponse.class);
                                if (ingredientRq.getStockUnitId() != 0) {
                                    var stu = stockUnitRepository.findById(ingredientRq.getStockUnitId()).get();
                                    if (stu != null) {
                                        ingredientItemResponse.setStockUnitResponse(mapper.map(stu, StockUnitResponse.class));
                                    }
                                }

                                ingredients.add(ingredientItemResponse);
                            }
                        }
                        variantRepsone.setIngredients(ingredients);
                        variantRepsones.add(variantRepsone);
                    } catch (Exception e) {
                        throw new ErrorException("Tạo giá hàng thất bại");
                    }
                }
            }

            itemRepsone = mapper.map(ItemNew, ItemRepsone.class);
            itemRepsone.setStockUnitResponse(stockUnitResponse);
            itemRepsone.setVariants(variantRepsones);
        } catch (Exception e) {
            throw new ErrorException("Tạo mặt hàng thất bại");
        }

        return itemRepsone;
    }

    //api update
    @Override
    @Transactional(rollbackOn = Exception.class)
    public ItemRepsone update(CreateItemRequest request, int id) {
        val item = itemRepository.findById(id);
        if (item.get() == null) throw new ErrorException("Không tìm thấy người dùng");
        if (request.getName() == null) throw new ErrorException("Tên mặt hàng không được để trống");
        if (request.getName() != null) item.get().setName(request.getName());
        item.get().setDescription(request.getDescription());
        item.get().setDiscountPercentage(request.getDiscountPercentage());

        List<Variant> variants = variantRepository.findVariantByItemId(id);
        updateVariant(request.getVariantRequest(), variants, id);

        item.get().setModifiedOn(CommonCode.getTimestamp());
        ItemRepsone itemRepsone = null;
        try {
            var itemNew = itemRepository.save(item.get());
            itemRepsone = mapper.map(itemNew, ItemRepsone.class);
        } catch (Exception e) {
            throw new ErrorException("Cập nhật khách hàng thất bại");
        }
        return itemRepsone;
    }

    //api get id
    @Override
    public ItemRepsone getById(int id) {
        if (id == 0) throw new ErrorException("Không có id");
        var item = itemRepository.findById(id);
        if (item == null) throw new ErrorException("Không tìm thấy khách hàng");
        var itemResponse = mapper.map(item.get(), ItemRepsone.class);
        var data = variantRepository.findVariantByItemId(id);

        var category = categoryRepository.findById(item.get().getCategoryId());
        var categoryRes = mapper.map(category.get(), CategoryResponse.class);
        itemResponse.setCategory(categoryRes);
        if (data != null) {
            List<VariantRepsone> variants = new ArrayList<>();
            for (var i : data) {
                VariantRepsone variantRepsone = mapper.map(i, VariantRepsone.class);
                variantRepsone.setName(i.getName());
                variantRepsone.setPrice(i.getPrice());
                variantRepsone.setStatus(i.getStatus());

                var itemIngredients = itemIngredientRepository.findItemIngredientByVariantIdAndItemId(i.getId(), id);
                if (itemIngredients != null) {
                    List<IngredientItemResponse> ingredientItemResponses = new ArrayList<>();
                    for (var itemG : itemIngredients) {
                        var ingredient = ingredientRepository.findById(itemG.getIngredientId());
                        IngredientItemResponse ingredientItemResponse = mapper.map(itemG, IngredientItemResponse.class);
                        ingredientItemResponse.setName(ingredient.get().getName());
                        ingredientItemResponse.setIngredientId(itemG.getIngredientId());
                        ingredientItemResponse.setAmountConsume(itemG.getAmountConsume());
                        var stockUnit = stockUnitRepository.findById(ingredient.get().getStockUnitId());
                        var stockUnitRes = mapper.map(stockUnit.get(), StockUnitResponse.class);
                        ingredientItemResponse.setStockUnitResponse(stockUnitRes);
                        ingredientItemResponses.add(ingredientItemResponse);
                    }
                    variantRepsone.setIngredients(ingredientItemResponses);
                }
                variants.add(variantRepsone);
            }
            itemResponse.setVariants(variants);
        }

        return itemResponse;
    }

    //api xóa
    @Override
    public void delete(int id) {
        val item = itemRepository.findById(id);
        if (item.get() == null) throw new ErrorException("Không tìm thấy mặt hàng");
        item.get().setStatus(CommonStatus.VariantStatus.DELETED);
        item.get().setModifiedOn(CommonCode.getTimestamp());
        val data = variantRepository.findVariantByItemId(id);
        if (data != null) {
            for (var i : data) {
                i.setStatus(CommonStatus.VariantStatus.DELETED);
                variantRepository.save(i);
            }
        }
        try {
            itemRepository.save(item.get());
        } catch (Exception e) {
            throw new ErrorException("Xóa mặt hàng thất bại");
        }
    }

    //api filter
    @Override
    public PagingListResponse<ItemRepsone> filter(ItemRequest filter) {
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
                    //.fields("name,phone_number")
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
        Page<Item> results;
        if (filters.size() > 0)
            results = itemRepository.findAll(filterRepository.getSpecificationFromFilters(filters), pageable);
        else results = itemRepository.findAll(pageable);
        List<ItemRepsone> itemRepsones = new ArrayList<>();
        for (val item : results.getContent()
        ) {
            val itemResponse = mapper.map(item, ItemRepsone.class);
            var data = variantRepository.findVariantByItemId(itemResponse.getId());
            List<VariantRepsone> variantRepsones = new ArrayList<>();
            for (val i : data){
            val variantResponse = mapper.map(i,VariantRepsone.class);
            variantRepsones.add(variantResponse);
            }
            itemResponse.setVariants(variantRepsones);
            itemRepsones.add(itemResponse);
        }

        return new PagingListResponse<>(
                itemRepsones,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), results.getTotalElements()));
    }

    @Transactional(rollbackOn = Exception.class)
     void updateVariant(List<CreateVariantRequest> variantRequests, List<Variant> variants, int itemId) {
        List<Variant> variantNews = new ArrayList<>();

        if (variants != null) {
            if (variantRequests != null) {
                for (val variantRq : variantRequests) {
                    var variant = mapper.map(variantRq, Variant.class);
                    //variant add
                    if (variantRq.getId() == 0) {
                        variant.setCreatedOn();
                        variant.setModifiedOn();
                        variant.setItemId(itemId);
                        variant.setStatus(CommonStatus.VariantStatus.ACTIVE);
                        var variantAdd = variantRepository.save(variant);
                        updateIngredients(variantRq.getIngredients(), null, itemId, variantAdd.getId());
                    } else {
                        //variant update
                        var variantOld = variants.stream().filter(v -> v.getId().equals(variant.getId())).collect(Collectors.toList()).stream().findFirst().orElse(null);
                        if (variantOld != null) {
                            variantOld.setModifiedOn();
                            variantOld.setName(variant.getName());
                            variantOld.setPrice(variant.getPrice());
                            variantNews.add(variantOld);
                            var itemIngredients = itemIngredientRepository.findItemIngredientByVariantIdAndItemId(variantOld.getId(), itemId);
                            updateIngredients(variantRq.getIngredients(), itemIngredients, itemId, variantOld.getId());
                        }
                    }
                }
                //Variant deleted
                for (var variant : variants) {
                    var variantDeleted = variantRequests.stream().filter(vq -> vq.getId() == variant.getId()).collect(Collectors.toList()).stream().findFirst();
                    if (!variantDeleted.isPresent() || variantDeleted.get() == null) {
                        var itemIngredients = itemIngredientRepository.findItemIngredientByVariantIdAndItemId(variant.getId(), itemId);
                        updateIngredients(null, itemIngredients, itemId, variant.getId());
                        variant.setModifiedOn();
                        variant.setStatus(CommonStatus.VariantStatus.DELETED);
                        variantNews.add(variant);
                    }
                }
            }
            if(variantNews != null && variantNews.size() != 0){
                variantRepository.saveAll(variantNews);
            }
        }
    }

    @Transactional(rollbackOn = Exception.class)
     void updateIngredients(List<IngredientCreateItemRequest> ingredientItemRequests, List<ItemIngredient> itemIngredients, int itemId, int variantId) {
        List<ItemIngredient> itemIngredientNews = new ArrayList<>();
        //Xóa nguyên liệu
        if (ingredientItemRequests == null && itemIngredients != null) {
            for (val itemIngredient : itemIngredients) {
                itemIngredient.setStatus(CommonStatus.ItemIngredientStatus.DELETED);
                itemIngredient.setModifiedOn();
                itemIngredientNews.add(itemIngredient);
            }
        }
        //Thêm nguyên liệu
        if (ingredientItemRequests != null && itemIngredients == null) {
            for (val request : ingredientItemRequests) {
                ItemIngredient itemIngredient = new ItemIngredient();
                itemIngredient.setItemId(itemIngredient.getItemId());
                itemIngredient.setStatus(CommonStatus.ItemIngredientStatus.ACTIVE);
                itemIngredient.setModifiedOn();
                itemIngredient.setCreatedOn();
                itemIngredient.setItemId(itemId);
                itemIngredient.setVariantId(variantId);
                itemIngredient.setIngredientId(request.getIngredientId());
                itemIngredient.setAmountConsume(request.getAmountConsume());
                itemIngredient.setStockUnitId(request.getStockUnitId());
                itemIngredientNews.add(itemIngredient);
            }
        }
        //cập nhật nguyên liệu
        if (ingredientItemRequests != null && itemIngredients != null) {
            for (val request : ingredientItemRequests) {
                var itemIngredient = itemIngredientRepository.findById(request.getId());
                var itemIngredientNew = new ItemIngredient();
                if(!itemIngredient.isPresent() || itemIngredient == null){
                    itemIngredientNew.setCreatedOn();
                    itemIngredientNew.setStatus(CommonStatus.ItemIngredientStatus.ACTIVE);
                }else{
                    itemIngredientNew = itemIngredient.get();
                }
                itemIngredientNew.setItemId(itemId);
                itemIngredientNew.setModifiedOn();
                itemIngredientNew.setItemId(itemId);
                itemIngredientNew.setVariantId(variantId);
                itemIngredientNew.setIngredientId(request.getIngredientId());
                itemIngredientNew.setAmountConsume(request.getAmountConsume());
                itemIngredientNew.setStockUnitId(request.getStockUnitId());
                itemIngredientNews.add(itemIngredientNew);
            }
        }

        if(itemIngredientNews != null && itemIngredientNews.size() != 0){
            itemIngredientRepository.saveAll(itemIngredientNews);
        }
    }
}

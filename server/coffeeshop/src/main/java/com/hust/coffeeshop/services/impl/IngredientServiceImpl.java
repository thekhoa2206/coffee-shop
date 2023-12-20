package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.common.TheadContextEnum;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.ingredient.IngredientFilterRequest;
import com.hust.coffeeshop.models.dto.ingredient.IngredientRequest;
import com.hust.coffeeshop.models.dto.ingredient.IngredientResponse;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitResponse;
import com.hust.coffeeshop.models.entity.*;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.IngredientService;
import lombok.val;
import org.apache.logging.log4j.ThreadContext;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class IngredientServiceImpl implements IngredientService {
    private final IngredientRepository ingredientRepository;
    private final ItemIngredientRepository itemIngredientRepository;
    private final ModelMapper mapper;
    private final FilterRepository filterRepository;
    private final StockUnitRepository stockUnitRepository;
    private final StocktakingRepository stocktakingRepository;
    private final InventoryLogRepository inventoryLogRepository;

    private final ItemRepository itemRepository;
    private final VariantRepository variantRepository;

    public IngredientServiceImpl(IngredientRepository ingredientRepository, ItemIngredientRepository itemIngredientRepository, ModelMapper mapper, FilterRepository filterRepository, StockUnitRepository stockUnitRepository, StocktakingRepository stocktakingRepository, InventoryLogRepository inventoryLogRepository, ItemRepository itemRepository, VariantRepository variantRepository) {
        this.ingredientRepository = ingredientRepository;
        this.itemIngredientRepository = itemIngredientRepository;
        this.mapper = mapper;
        this.filterRepository = filterRepository;
        this.stockUnitRepository = stockUnitRepository;
        this.stocktakingRepository = stocktakingRepository;
        this.inventoryLogRepository = inventoryLogRepository;
        this.itemRepository = itemRepository;
        this.variantRepository = variantRepository;
    }

    @Override
    public IngredientResponse create(IngredientRequest request) {
        if (request.getName() == null) throw new ErrorException("Tên nguyên liệu không được để trống");
        Ingredient ingredient = new Ingredient();
        ingredient.setName(request.getName());
        ingredient.setStatus(CommonStatus.IngredientStatus.ACTIVE);
        ingredient.setExportPrice(request.getExportPrice() != null ? request.getExportPrice() : BigDecimal.ZERO);
        ingredient.setCreatedOn(CommonCode.getTimestamp());
        ingredient.setModifiedOn(0);
        ingredient.setQuantity(request.getQuantity());
        ingredient.setStockUnitId(request.getStockUnitId());
        ingredient.setProduct(request.isProduct());
        StockUnit stockUnit = new StockUnit();
        if (request.getStockUnitId() == 0) {
            stockUnit = stockUnitRepository.findById(request.getStockUnitId()).get();
        }

        ingredient = ingredientRepository.save(ingredient);
        if(request.isProduct()) saveVariant(request, ingredient.getId());
        var stockUnitResponse = mapper.map(stockUnit, StockUnitResponse.class);
        stockUnitResponse.set();
        var ingredientResponse = mapper.map(ingredient, IngredientResponse.class);
        ingredientResponse.set();
        ingredientResponse.setStockUnitResponse(stockUnitResponse);
        return ingredientResponse;
    }
    private void saveVariant(IngredientRequest request, int id){
        var username = ThreadContext.get(TheadContextEnum.JWT_USER_NAME.name());
        if(request.isProduct()){
            Item item = new Item();
            item.setName(request.getName());
            item.setStatus(CommonStatus.ItemIngredientStatus.ACTIVE);
            item.setCreatedOn();
            item.setModifiedOn();
            item.setStockUnitId(request.getStockUnitId());
            item.setCreatedBy(username);
            item.setModifiedBy(username);

            item = itemRepository.save(item);

            Variant variant = new Variant();
            variant.setStatus(1);
            variant.setName(request.getName());
            variant.setPrice(request.getExportPrice());
            variant.setCreatedBy(username);
            variant.setModifiedBy(username);
            variant.setItemId(item.getId());
            variant.setModifiedOn();
            variant.setCreatedOn();

            variant = variantRepository.save(variant);

            ItemIngredient itemIngredient = new ItemIngredient();
            itemIngredient.setIngredientId(id);
            itemIngredient.setVariantId(variant.getId());
            itemIngredient.setItemId(item.getId());
            itemIngredient.setStatus(1);
            itemIngredient.setCreatedBy(username);
            itemIngredient.setModifiedBy(username);
            itemIngredient.setModifiedOn();
            itemIngredient.setCreatedOn();
            itemIngredient.setAmountConsume(1);

            itemIngredientRepository.save(itemIngredient);
        }
    }
    @Override
    public IngredientResponse update(IngredientRequest request, int id) {
        if (id == 0) throw new ErrorException("Không có thông tin nguyên liệu");
        var ingredient = ingredientRepository.findById(id).get();
        if (ingredient == null) throw new ErrorException("Không tìm thấy nguyên liệu");

        ingredient.setName(request.getName());
        ingredient.setExportPrice(request.getExportPrice());
        ingredient.setStockUnitId(request.getStockUnitId());
        ingredient.setModifiedOn(0);
        if(request.isProduct() && !ingredient.isProduct()){
            saveVariant(request, ingredient.getId());
        }
        ingredient.setProduct(request.isProduct());
        ingredient = ingredientRepository.save(ingredient);
        var ingredientResponse = mapper.map(ingredient, IngredientResponse.class);
        ingredientResponse.set();
        return ingredientResponse;
    }

    @Override
    public void delete(int id) {
        if (id == 0) throw new ErrorException("Không có thông tin nguyên liệu");
        var ingredient = ingredientRepository.findById(id).get();
        ingredient.setModifiedOn(0);
        ingredient.setStatus(CommonStatus.IngredientStatus.DELETED);
        ingredientRepository.save(ingredient);
        BigDecimal money = BigDecimal.ZERO;
        money = ingredient.getExportPrice().multiply(BigDecimal.valueOf(ingredient.getQuantity()));
        Stocktaking stocktaking = new Stocktaking();
        stocktaking.setCode(CommonCode.GenerateCodeexport());
        stocktaking.setStatus(2);
        stocktaking.setName("Xoá nguyên liệu"+ ingredient.getName());
        stocktaking.setTotalMoney(money);
        stocktaking.setCreatedOn(CommonCode.getTimestamp());
        stocktaking.setPayment(1);
        stocktaking.setType("export");
        stocktaking.setDescription("Xoá nguyên liệu");
        stocktaking.setModifiedOn(0);
        var stoctaking= stocktakingRepository.save(stocktaking);

        InventoryLog inventoryLog = new InventoryLog();
        //lưu vào bảng log kho
        inventoryLog.setCode(stoctaking.getCode());
        inventoryLog.setObjectId(stoctaking.getId());
        inventoryLog.setNote(stoctaking.getDescription());
        inventoryLog.setCreatedOn(CommonCode.getTimestamp());
        inventoryLog.setModifiedOn(0);
        inventoryLog.setType("export");
        inventoryLog.setIngredientId(ingredient.getId());
        inventoryLog.setStockRemain(0);
        inventoryLog.setAmountChargeInUnit("-"+ingredient.getQuantity());
        inventoryLog.setStatus(2);
        inventoryLogRepository.save(inventoryLog);
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
        return ingredientResponse;
    }

    @Override
    public PagingListResponse<IngredientResponse> filter(IngredientFilterRequest filter) {
        var results = filterIngredient(filter);
        List<IngredientResponse> ingredientResponses = new ArrayList<>();
        for (val ingredient : results.getContent()
        ) {
            val ingredientResponse = mapper.map(ingredient, IngredientResponse.class);
            var stockUnit = stockUnitRepository.findById(ingredient.getStockUnitId()).get();
            var stockUnitResponse = mapper.map(stockUnit, StockUnitResponse.class);
            ingredientResponse.setStockUnitResponse(stockUnitResponse);
            ingredientResponses.add(ingredientResponse);
        }

        return new PagingListResponse<>(
                ingredientResponses,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), results.getTotalElements()));
    }
    @Override
    public Page<Ingredient> filterIngredient(IngredientFilterRequest filter){
        Pageable pageable = PageRequest.of(
                filter.getPage() - 1,
                filter.getLimit(),
                Sort.by(Sort.Direction.DESC, "id"));
        var filters = new ArrayList<Filter>();
        //variantIds
        if (filter.getVariantIds() != null) {
            var ingredientItems = itemIngredientRepository.findItemIngredientByVariantIds(filter.getVariantIds());
            var ingredientIds= ingredientItems.stream().map(ItemIngredient::getIngredientId).collect(Collectors.toList());
            if(ingredientItems != null && ingredientIds.size() > 0){
                if(filter.getIds() != null){
                    filter.getIds().addAll(ingredientIds);
                }else{
                    filter.setIds(ingredientIds);
                }
            }
        }
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
        }else{
            statuses.add(1);
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
        if (statuses != null && statuses.size() > 0) {
            Filter statuses1 = Filter.builder()
                    .field("status")
                    .operator(QueryOperator.IN)
                    .values(statuses.stream().map(i -> i.toString()).collect(Collectors.toList()))
                    .build();
            filters.add(statuses1);
        }
        Page<Ingredient> results;
        if (filters.size() > 0)
            results = ingredientRepository.findAll(filterRepository.getSpecificationFromFilters(filters), pageable);
        else results = ingredientRepository.findAll(pageable);

        return results;
    }
}

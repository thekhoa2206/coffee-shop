package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.ingredient.IngredientResponse;
import com.hust.coffeeshop.models.dto.inventory.repsone.InventoryIngredientReponse;
import com.hust.coffeeshop.models.dto.inventory.repsone.InventoryReponse;
import com.hust.coffeeshop.models.dto.inventory.request.CreateinventoryRequest;
import com.hust.coffeeshop.models.dto.item.request.ItemRequest;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;
import com.hust.coffeeshop.models.dto.variant.response.VariantRepsone;
import com.hust.coffeeshop.models.entity.Inventory;
import com.hust.coffeeshop.models.entity.InventoryIngredient;
import com.hust.coffeeshop.models.entity.Item;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.BaseService;
import com.hust.coffeeshop.services.InventoryService;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryServiceImpl implements InventoryService {
    private final InventoryRepository inventoryRepository;
    private final ModelMapper mapper;
    private final InventoryIngredientRepository inventoryIngredientRepository;
    private final IngredientRepository ingredientRepository;
    private final BaseService baseService;
    private final FilterRepository filterRepository;


    public InventoryServiceImpl(InventoryRepository inventoryRepository, ModelMapper mapper, InventoryIngredientRepository inventoryIngredientRepository, IngredientRepository ingredientRepository, BaseService baseService, FilterRepository filterRepository) {
        this.inventoryRepository = inventoryRepository;
        this.mapper = mapper;
        this.inventoryIngredientRepository = inventoryIngredientRepository;
        this.ingredientRepository = ingredientRepository;
        this.baseService = baseService;
        this.filterRepository = filterRepository;
    }
    @Override
    public InventoryReponse create(CreateinventoryRequest request, HttpServletRequest requestHttp) {
//        var user= baseService.getuser(requestHttp);
        if (request.getName() == null) throw new ErrorException("Tên mặt hàng không được để trống");
        Inventory inventory = mapper.map(request, Inventory.class);
        if(request.getType().equals("import")){
            inventory.setCode(CommonCode.GenerateCodeWarehouse());
        }
        else {
            inventory.setCode(CommonCode.GenerateCodeexport());
        }
        inventory.setName(request.getName());
        inventory.setStatus(1);
        inventory.setDescription(request.getDescription());
        inventory.setTotalMoney(request.getTotalMoney());
        inventory.setCreatedOn(CommonCode.getTimestamp());
        inventory.setModifiedOn(0);
        inventory.setType(request.getType());
//        inventory.setCreatedBy(user.getId());
        var inventoryNew= inventoryRepository.save(inventory);
        List<InventoryIngredient> inventoryIngredients = new ArrayList<>();
        if(request.getObject().size() != 0){
            for(val i : request.getObject()) {
                InventoryIngredient inventoryIngredient = new InventoryIngredient();
                inventoryIngredient.setInventoryId(inventoryNew.getId());
                inventoryIngredient.setIngredientId(i.getIngredientId());
                inventoryIngredient.setQuantity(i.getQuantity());
                inventoryIngredient.setIngredientMoney(i.getIngredientMoney());
                inventoryIngredient.setStatus(1);
                inventoryIngredient.setCreatedOn(CommonCode.getTimestamp());
                inventoryIngredient.setModifiedOn(0);
                inventoryIngredients.add(inventoryIngredient);
            }
            inventoryIngredientRepository.saveAll(inventoryIngredients);
        }
       var InventoryIngredientReponse = getIngredients(inventoryIngredients);
        val inventoryReponse = mapper.map(inventory, InventoryReponse.class);
//        inventoryReponse.setCreatedBy(user.getName());
        inventoryReponse.setObject(InventoryIngredientReponse);
        return inventoryReponse;

    }
    @Override
    public InventoryReponse getbyId( int id) {
        var inventory = inventoryRepository.findById(id);
        if(inventory.get()== null) throw new  ErrorException("Không tìm thấy Phiếu");
        val inventoryReponse = mapper.map(inventory.get(), InventoryReponse.class);
        val inventoryIngredients = inventoryIngredientRepository.findItemIngredientByInventoryId(id);
        val data = getIngredients(inventoryIngredients);
        inventoryReponse.setObject(data);
        return inventoryReponse;


    }
    //api filter
    @Override
    public PagingListResponse<InventoryReponse> filter(ItemRequest filter) {
        Pageable pageable = PageRequest.of(
                filter.getPage() - 1,
                filter.getLimit(),
                Sort.by(Sort.Direction.DESC, "id"));
        var filters = new ArrayList<Filter>();

        //code
        if (filter.getIds() != null) {
            Filter ids = Filter.builder()
                    .field("code")
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
        Page<Inventory> results;
        if (filters.size() > 0)
            results = inventoryRepository.findAll(filterRepository.getSpecificationFromFilters(filters), pageable);
        else results = inventoryRepository.findAll(pageable);
        List<InventoryReponse> inventoryReponses = new ArrayList<>();
        for (val i : results.getContent()
        ) {
            val inventoryReponse = mapper.map(i, InventoryReponse.class);
            val inventoryIngredients = inventoryIngredientRepository.findItemIngredientByInventoryId(i.getId());
            val data = getIngredients(inventoryIngredients);
            inventoryReponse.setObject(data);
            inventoryReponses.add(inventoryReponse);

        }

        return new PagingListResponse<>(
                inventoryReponses,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), results.getTotalElements()));
    }
    @Transactional(rollbackOn = Exception.class)
    List<InventoryIngredientReponse> getIngredients(List<InventoryIngredient> inventoryIngredients) {
        if(inventoryIngredients.size()!=0){
            List<InventoryIngredientReponse> inventoryIngredientReponses = new ArrayList<>();
            for (val i : inventoryIngredients){
                InventoryIngredientReponse data = new InventoryIngredientReponse();
                data.setIngredientMoney(i.getIngredientMoney());
                data.setQuantity(i.getQuantity());
               val ingredient =  ingredientRepository.findById(i.getId());
               val ingredientReponse = mapper.map(ingredient.get(), IngredientResponse.class);
               data.setIngredientResponse(ingredientReponse);
               inventoryIngredientReponses.add(data);
            }
            return inventoryIngredientReponses;
        }else {
            return null;
        }
    }
}

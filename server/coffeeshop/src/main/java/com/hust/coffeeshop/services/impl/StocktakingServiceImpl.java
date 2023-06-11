package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.ingredient.IngredientResponse;
import com.hust.coffeeshop.models.dto.stocktaking.repsone.StocktakingIngredientReponse;
import com.hust.coffeeshop.models.dto.stocktaking.repsone.StocktakingReponse;
import com.hust.coffeeshop.models.dto.stocktaking.request.CreateStocktakingRequest;
import com.hust.coffeeshop.models.dto.item.request.ItemRequest;
import com.hust.coffeeshop.models.dto.stocktaking.request.StoctakingFilterRequest;
import com.hust.coffeeshop.models.entity.Stocktaking;
import com.hust.coffeeshop.models.entity.StocktakingIngredient;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.BaseService;
import com.hust.coffeeshop.services.StocktakingService;
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
public class StocktakingServiceImpl implements StocktakingService {
    private final StocktakingRepository stocktakingRepository;
    private final ModelMapper mapper;
    private final StocktakingIngredientRepository stocktakingIngredientRepository;
    private final IngredientRepository ingredientRepository;
    private final BaseService baseService;
    private final FilterRepository filterRepository;


    public StocktakingServiceImpl(StocktakingRepository stocktakingRepository, ModelMapper mapper, StocktakingIngredientRepository stocktakingIngredientRepository, IngredientRepository ingredientRepository, BaseService baseService, FilterRepository filterRepository) {
        this.stocktakingRepository = stocktakingRepository;
        this.mapper = mapper;
        this.stocktakingIngredientRepository = stocktakingIngredientRepository;
        this.ingredientRepository = ingredientRepository;
        this.baseService = baseService;
        this.filterRepository = filterRepository;
    }
    @Override
    public StocktakingReponse create(CreateStocktakingRequest request, HttpServletRequest requestHttp) {
//        var user= baseService.getuser(requestHttp);
        if (request.getName() == null) throw new ErrorException("Tên mặt hàng không được để trống");
        Stocktaking stocktaking = mapper.map(request, Stocktaking.class);
        if(request.getType().equals("import")){
            stocktaking.setCode(CommonCode.GenerateCodeWarehouse());
        }
        else {
            stocktaking.setCode(CommonCode.GenerateCodeexport());
        }
        stocktaking.setName(request.getName());
        stocktaking.setStatus(1);
        stocktaking.setDescription(request.getDescription());
        stocktaking.setTotalMoney(request.getTotalMoney());
        stocktaking.setCreatedOn(CommonCode.getTimestamp());
        stocktaking.setModifiedOn(0);
        stocktaking.setType(request.getType());
//        inventory.setCreatedBy(user.getId());
        var stocktakingNew= stocktakingRepository.save(stocktaking);
        List<StocktakingIngredient> stocktakingIngredients = new ArrayList<>();
        if(request.getObject().size() != 0){
            for(val i : request.getObject()) {
                StocktakingIngredient stocktakingIngredient = new StocktakingIngredient();
                stocktakingIngredient.setStocktakingId(stocktakingNew.getId());
                stocktakingIngredient.setIngredientId(i.getIngredientId());
                stocktakingIngredient.setQuantity(i.getQuantity());
                stocktakingIngredient.setIngredientMoney(i.getIngredientMoney());
                stocktakingIngredient.setStatus(1);
                stocktakingIngredient.setCreatedOn(CommonCode.getTimestamp());
                stocktakingIngredient.setModifiedOn(0);
                stocktakingIngredients.add(stocktakingIngredient);
            }
            stocktakingIngredientRepository.saveAll(stocktakingIngredients);
        }
       var InventoryIngredientReponse = getIngredients(stocktakingIngredients);
        val inventoryReponse = mapper.map(stocktaking, StocktakingReponse.class);
//        inventoryReponse.setCreatedBy(user.getName());
        inventoryReponse.setObject(InventoryIngredientReponse);
        return inventoryReponse;

    }
    @Override
    public StocktakingReponse getbyId(int id) {
        var stocktaking = stocktakingRepository.findById(id);
        if(stocktaking.get()== null) throw new  ErrorException("Không tìm thấy Phiếu");
        val stocktakingReponse = mapper.map(stocktaking.get(), StocktakingReponse.class);
        val stocktakingIngredients = stocktakingIngredientRepository.findItemIngredientByInventoryId(id);
        val data = getIngredients(stocktakingIngredients);
        stocktakingReponse.setObject(data);
        return stocktakingReponse;


    }
    //api filter
    @Override
    public PagingListResponse<StocktakingReponse> filter(StoctakingFilterRequest filter) {
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
        //type
        if (filter.getType() != null && !filter.getType().isEmpty()) {
            Filter type = Filter.builder()
                    .field("type")
                    .operator(QueryOperator.IN)
                    .values(Arrays.asList(filter.getType().split(",")))
                    .build();
            filters.add(type);
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
        Page<Stocktaking> results;
        if (filters.size() > 0)
            results = stocktakingRepository.findAll(filterRepository.getSpecificationFromFilters(filters), pageable);
        else results = stocktakingRepository.findAll(pageable);
        List<StocktakingReponse> stocktakingReponses = new ArrayList<>();
        for (val i : results.getContent()
        ) {
            val stocktakingReponse = mapper.map(i, StocktakingReponse.class);
            val stocktakingIngredients = stocktakingIngredientRepository.findItemIngredientByInventoryId(i.getId());
            val data = getIngredients(stocktakingIngredients);
            stocktakingReponse.setObject(data);
            stocktakingReponses.add(stocktakingReponse);

        }

        return new PagingListResponse<>(
                stocktakingReponses,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), results.getTotalElements()));
    }
    @Transactional(rollbackOn = Exception.class)
    List<StocktakingIngredientReponse> getIngredients(List<StocktakingIngredient> stocktakingIngredients) {
        if(stocktakingIngredients.size()!=0){
            List<StocktakingIngredientReponse> stocktakingIngredientRepons = new ArrayList<>();
            for (val i : stocktakingIngredients){
                StocktakingIngredientReponse data = new StocktakingIngredientReponse();
                data.setIngredientMoney(i.getIngredientMoney());
                data.setQuantity(i.getQuantity());
               val ingredient =  ingredientRepository.findById(i.getId());
               val ingredientReponse = mapper.map(ingredient.get(), IngredientResponse.class);
               data.setIngredientResponse(ingredientReponse);
               stocktakingIngredientRepons.add(data);
            }
            return stocktakingIngredientRepons;
        }else {
            return null;
        }
    }
}

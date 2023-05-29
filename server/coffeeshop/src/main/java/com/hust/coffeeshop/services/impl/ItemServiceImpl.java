package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.customer.CustomerFilterRequest;
import com.hust.coffeeshop.models.dto.customer.CustomerResponse;
import com.hust.coffeeshop.models.dto.item.request.CreateItemRequest;
import com.hust.coffeeshop.models.dto.item.request.ItemRequest;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;
import com.hust.coffeeshop.models.dto.variant.response.VariantRepsone;
import com.hust.coffeeshop.models.entity.Item;
import com.hust.coffeeshop.models.entity.Variant;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.ItemService;
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

public class ItemServiceImpl implements ItemService {
    private final ItemRepository itemRepository;
    private final ModelMapper mapper;
    private final VariantRepository variantRepository;
    private  final FilterRepository filterRepository;

    public ItemServiceImpl(ItemRepository itemRepository, ModelMapper mapper, VariantRepository variantRepository, FilterRepository filterRepository) {
        this.itemRepository = itemRepository;
        this.mapper = mapper;
        this.variantRepository = variantRepository;
        this.filterRepository = filterRepository;
    }

    //api tạo
    @Override
    public ItemRepsone create(CreateItemRequest request) {
        if (request.getName() == null) throw new ErrorException("Tên khách hàng không được để trống");

        Item item = mapper.map(request, Item.class);
        item.setStatus(CommonStatus.CustomerStatus.ACTIVE);
        item.setCreatedOn(CommonCode.getTimestamp());
        ItemRepsone itemRepsone = null;
        try {
            var ItemNew = itemRepository.save(item);
            if(request.getVariantRequest() != null)
            {
                for( var i : request.getVariantRequest())
                {
                    Variant variant = mapper.map(request.getVariantRequest(),Variant.class);
                    variant.setStatus(CommonStatus.CustomerStatus.ACTIVE);
                    variant.setCreatedOn(CommonCode.getTimestamp());
                    variant.setName(i.getName());
                    variant.setItemId(ItemNew.getId());
                    try {
                    var variantNew = variantRepository.save(variant);
                } catch (Exception e) {
                    throw new ErrorException("Tạo giá hàng thất bại");
                    }
                }
            }
            itemRepsone = mapper.map(ItemNew, ItemRepsone.class);
        } catch (Exception e) {
            throw new ErrorException("Tạo mặt hàng thất bại");
        }

        return itemRepsone;
    }
    //api update
    @Override
    public ItemRepsone update(CreateItemRequest request, int id) {
        val item = itemRepository.findById(id);
        if (item.get() == null) throw new ErrorException("Không tìm thấy người dùng");
        if (request.getName() != null) item.get().setName(request.getName());
        if (request.getDescription()!= null) item.get().setDescription(request.getDescription());
        if (request.getDiscountPercentage() != null) item.get().setDiscountPercentage(request.getDiscountPercentage());
        if(request.getVariantRequest() != null){
            for(var i : request.getVariantRequest()){
                val variant = variantRepository.findById(i.getVariantId());
                if(variant.get() == null) throw new ErrorException("Không tìm thấy giá bán");
                if(i.getPrice()!= null)   variant.get().setPrice(i.getPrice());
                if(i.getName()!= null) variant.get().setName(i.getName());
            }
        }
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
        var data = variantRepository.findUserByItemId(id);
        if(data != null){
            List<VariantRepsone> variants = new ArrayList<>();
            for(var i :data){
                VariantRepsone variantRepsone = new VariantRepsone();
                variantRepsone.setName(i.getName());
                variantRepsone.setPrice(i.getPrice());
                variantRepsone.setStatus(i.getStatus());
              variants.add(variantRepsone);
            }
            itemResponse.setVariant(variants);
        }
        return itemResponse;
    }
    //api xóa
    @Override
    public void delete(int id) {
        val item = itemRepository.findById(id);
        if (item.get() == null) throw new ErrorException("Không tìm thấy mặt hàng");
        item.get().setStatus(CommonStatus.CustomerStatus.DELETED);
        item.get().setModifiedOn(CommonCode.getTimestamp());
        val data = variantRepository.findUserByItemId(id);
        if(data != null){
            for ( var i: data)
            {
                i.setStatus(CommonStatus.CustomerStatus.DELETED);
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
            var x = Arrays.asList(filter.getStatuses().split(","));
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
            itemRepsones.add(itemResponse);
        }

        return new PagingListResponse<>(
                itemRepsones,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), results.getTotalElements()));
    }
}
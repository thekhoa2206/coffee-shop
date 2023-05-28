package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.models.dto.customer.CustomerRequest;
import com.hust.coffeeshop.models.dto.customer.CustomerResponse;
import com.hust.coffeeshop.models.dto.item.request.CreateItemRequest;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;
import com.hust.coffeeshop.models.dto.variant.response.VariantRepsone;
import com.hust.coffeeshop.models.entity.Item;
import com.hust.coffeeshop.models.entity.Variant;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.ItemRepository;
import com.hust.coffeeshop.models.repository.VariantRepository;
import com.hust.coffeeshop.services.ItemService;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service

public class ItemServiceImpl implements ItemService {
    private final ItemRepository itemRepository;
    private final ModelMapper mapper;
    private final VariantRepository variantRepository;

    public ItemServiceImpl(ItemRepository itemRepository, ModelMapper mapper, VariantRepository variantRepository) {
        this.itemRepository = itemRepository;
        this.mapper = mapper;
        this.variantRepository = variantRepository;
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
            if(request.getVariantRequest() != null){
                for( var i : request.getVariantRequest()){
                    Variant variant = mapper.map(request.getVariantRequest(),Variant.class);
                    variant.setStatus(CommonStatus.CustomerStatus.ACTIVE);
                    variant.setCreatedOn(CommonCode.getTimestamp());
                    variant.setItemId(ItemNew.getId());
                    VariantRepsone variantRepsone = null;
                try {
                    var variantNew = variantRepository.save(variant);
                    variantRepsone = mapper.map(variantNew,VariantRepsone.class);

                } catch (Exception e) {
                    throw new ErrorException("Tạo giá hàng thất bại");
                }  }
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
                var variant = variantRepository.findById(i.getVariantId());
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
        

        return itemResponse;
    }

}

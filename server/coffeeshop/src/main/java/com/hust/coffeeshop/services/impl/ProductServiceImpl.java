package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.product.ProductFilterRequest;
import com.hust.coffeeshop.models.dto.product.ProductResponse;
import com.hust.coffeeshop.models.repository.FilterRepository;
import com.hust.coffeeshop.models.repository.ItemRepository;
import com.hust.coffeeshop.services.ComboService;
import com.hust.coffeeshop.services.ItemService;
import com.hust.coffeeshop.services.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl implements ProductService {
    private final ModelMapper mapper;
    private final FilterRepository filterRepository;
    private final ItemRepository itemRepository;
    private final ItemService itemService;
    private final ComboService comboService;

    public ProductServiceImpl(ModelMapper mapper, FilterRepository filterRepository, ItemRepository itemRepository, ItemService itemService, ComboService comboService) {
        this.mapper = mapper;
        this.filterRepository = filterRepository;
        this.itemRepository = itemRepository;
        this.itemService = itemService;
        this.comboService = comboService;
    }

    //hàm filter danh sách sản phẩm (combo, mặt hàng) ở trạng thái active có thể bán
    @Override
    public PagingListResponse<ProductResponse> filter(ProductFilterRequest filter) {

        return null;
    }
}

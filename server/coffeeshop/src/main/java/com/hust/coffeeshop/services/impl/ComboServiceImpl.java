package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.category.CategoryResponse;
import com.hust.coffeeshop.models.dto.combo.request.CreateComboRequest;
import com.hust.coffeeshop.models.dto.combo.response.ComboItemResponse;
import com.hust.coffeeshop.models.dto.combo.response.ComboRespone;
import com.hust.coffeeshop.models.dto.item.request.ItemRequest;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;
import com.hust.coffeeshop.models.dto.variant.request.CreateVariantRequest;
import com.hust.coffeeshop.models.dto.variant.request.VariantComboRequest;
import com.hust.coffeeshop.models.dto.variant.response.VariantRepsone;
import com.hust.coffeeshop.models.entity.*;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.ComboService;
import com.hust.coffeeshop.services.ItemService;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComboServiceImpl implements ComboService {
    private final ComboRepository comboRepository;
    private final ModelMapper mapper;
    private final CategoryRepository categoryRepository;
    private final VariantRepository variantRepository;
    private final ItemRepository itemRepository;
    private final ItemService itemService;
    private final ComboItemRepository comboItemRepository;
    private final FilterRepository filterRepository;
    private static final Path CURRENT_FOLDER = Paths.get(System.getProperty("user.dir"));

    public ComboServiceImpl(ComboRepository comboRepository, ModelMapper mapper, CategoryRepository categoryRepository, VariantRepository variantRepository, ItemRepository itemRepository, ItemService itemService, ComboItemRepository comboItemRepository, FilterRepository filterRepository) {
        this.comboRepository = comboRepository;
        this.mapper = mapper;
        this.categoryRepository = categoryRepository;
        this.variantRepository = variantRepository;
        this.itemRepository = itemRepository;
        this.itemService = itemService;
        this.comboItemRepository = comboItemRepository;
        this.filterRepository = filterRepository;
    }

    @Override
    public ComboRespone create(CreateComboRequest request, MultipartFile image) throws IOException {
        if (request.getName() == null) throw new ErrorException("Tên combo không được để trống");
        Combo combo = new Combo();
        combo.setName(request.getName());
        combo.setStatus(CommonStatus.CustomerStatus.ACTIVE);
        combo.setPrice(request.getPrice() != null ? request.getPrice() : BigDecimal.ZERO);
        combo.setCreatedOn(CommonCode.getTimestamp());
        combo.setDescription(request.getDescription());
        combo.setDiscountPercentage(request.getDiscountPercentage());
        Path staticPath = Paths.get("static");
        Path imagePath = Paths.get("images");
        if (!Files.exists(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath))) {
            Files.createDirectories(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath));
        }
        Path file = CURRENT_FOLDER.resolve(staticPath)
                .resolve(imagePath).resolve(image.getOriginalFilename());
        try (OutputStream os = Files.newOutputStream(file)) {
            os.write(image.getBytes());
        }
        combo.setImageUrl(imagePath.resolve(image.getOriginalFilename()).toString());
        if (request.getCategoryId() != 0)
            combo.setCategoryId(request.getCategoryId());
        combo.setModifiedOn(0);
        try {
            var comboNew = comboRepository.save(combo);
            Category category = new Category();
            if (request.getCategoryId() != 0) {
                category = categoryRepository.findById(request.getCategoryId()).get();
            }
            var comboRespone = mapper.map(combo, ComboRespone.class);

            List<ComboItemResponse> itemRepsones = new ArrayList<>();
            if (request.getVarianIds().size() > 0) {
                for (var i : request.getVarianIds()) {
                    var variant = variantRepository.findById(i.getVariantId());
                    if (variant.get() == null) throw new ErrorException("không có item");
                    ComboItem comboItem = new ComboItem();
                    comboItem.setComboId(comboNew.getId());
                    comboItem.setItemId(variant.get().getItemId());
                    comboItem.setVariantId(variant.get().getId());
                    comboItem.setCreatedOn(CommonCode.getTimestamp());
                    comboItem.setQuantity(i.getQuantity());
                    comboItem.setStatus(1);
                    comboItem.setModifiedOn(0);
                    //lưu combo_id và item id vào bảng mapping
                    try {
                        comboItemRepository.save(comboItem);
                    } catch (Exception e) {
                        throw new ErrorException("tạo combomapping thất bại");
                    }
                    var itemResponse = getbyItemId(variant.get().getItemId(),i.getVariantId());
                    ComboItemResponse comboItemResponse = new ComboItemResponse();
                    comboItemResponse.setItem(itemResponse);
                    comboItemResponse.setQuantity(i.getQuantity());
                    itemRepsones.add(comboItemResponse);
                }
            }
            var categoryResponse = mapper.map(category, CategoryResponse.class);
            categoryResponse.set();
            comboRespone.setCategory(category);
            comboRespone.setItems(itemRepsones);
            return comboRespone;
        } catch (Exception e) {
            throw new ErrorException("tạo combothất bại");
        }

    }

    @Override
    public ComboRespone update(CreateComboRequest request, int id) {
        var combo = comboRepository.findById(id);
        if (combo == null) throw new ErrorException("không tìm thấy combo");
        if (request.getName() != null) combo.get().setName(request.getName());
        if (request.getDescription() != null) combo.get().setDescription(request.getDescription());
        if (request.getDiscountPercentage() != null) combo.get().setDiscountPercentage(request.getDiscountPercentage());
        combo.get().setPrice(request.getPrice() != null ? request.getPrice() : BigDecimal.ZERO);
//        if (request.getImageUrl() != null) combo.get().setImageUrl(request.getImageUrl());
        combo.get().setModifiedOn(CommonCode.getTimestamp());
        combo.get().setCategoryId(request.getCategoryId());
        var comboNew = comboRepository.save(combo.get());
        Category category = new Category();
        if (request.getCategoryId() != 0) {
            category = categoryRepository.findById(request.getCategoryId()).get();
        }
        var comboRespone = mapper.map(comboNew, ComboRespone.class);
        List<ItemRepsone> itemRepsones = new ArrayList<>();
        var categoryResponse = mapper.map(category, CategoryResponse.class);

        List<ComboItem> comboItems = comboItemRepository.findComboItemByComboId(id);
        updateVariant(request.getVarianIds(),comboItems,id);
        categoryResponse.set();
        comboRespone.setCategory(category);
        return comboRespone;
    }
    @Override
    public ComboRespone getbyId(int id) {
        if(id==0) throw new ErrorException("id không được để trống");
        var combo = comboRepository.findById(id);
        if(combo.get()== null ) throw new ErrorException("Combo không tồn tại");
        var comboRespone = mapper.map(combo.get(), ComboRespone.class);
        if(combo.get().getCategoryId() !=0){

           var category = categoryRepository.findById(combo.get().getCategoryId()).get();
            if(category!= null)
            comboRespone.setCategory(category);
        }
        List<ComboItem> comboItems = comboItemRepository.findComboItemByComboId(id);
        if(comboItems.size()>0){
            List<ComboItemResponse> itemRepsones = new ArrayList<>();
            for (var i : comboItems){
               var itemRepsone = getbyItemId(i.getItemId(),i.getVariantId());
               ComboItemResponse comboItemResponse = new ComboItemResponse();
               comboItemResponse.setItem(itemRepsone);
               comboItemResponse.setQuantity(i.getQuantity());
               comboItemResponse.setComboitemId(i.getId());
               itemRepsones.add(comboItemResponse);
            }
            comboRespone.setItems(itemRepsones);
        }
        return comboRespone;
    }

    @Transactional(rollbackOn = Exception.class)
    public ItemRepsone getbyItemId(int itemid, int variantId){
        var item = itemRepository.findById(itemid);
        var itemRepsone = mapper.map(item.get(),ItemRepsone.class);
        var variant =variantRepository.findById(variantId);
        var variantRepsone = mapper.map(variant.get(), VariantRepsone.class);
        List<VariantRepsone> variantRepsones = new ArrayList<>();
        variantRepsones.add(variantRepsone);
        itemRepsone.setVariants(variantRepsones);
        return itemRepsone;
    }
    //api xóa
    @Override
    public void delete(int id) {
        if(id==0) throw new ErrorException("id không được để trống");
        var combo = comboRepository.findById(id);
        if (combo.get() == null) throw new ErrorException("Không tìm thấy mặt hàng");
        combo.get().setStatus(CommonStatus.CustomerStatus.DELETED);
        combo.get().setModifiedOn(CommonCode.getTimestamp());
        List<ComboItem> comboItems = comboItemRepository.findComboItemByComboId(id);
        for(var i : comboItems){
            comboItemRepository.deleteById(i.getId());
        }
        try {
            comboRepository.save(combo.get());
        } catch (Exception e) {
            throw new ErrorException("Xóa mặt hàng thất bại");
        }
    }
    //api filter
    @Override
    public PagingListResponse<ComboRespone> filter(ItemRequest filter) {
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
        Page<Combo> results;
        if (filters.size() > 0)
            results = comboRepository.findAll(filterRepository.getSpecificationFromFilters(filters), pageable);
        else results = comboRepository.findAll(pageable);
        List<ComboRespone> comboRespones = new ArrayList<>();
        for (val combo : results.getContent()
        ) {
            val comboResponse = mapper.map(combo, ComboRespone.class);
            comboRespones.add(comboResponse);
        }

        return new PagingListResponse<>(
                comboRespones,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), results.getTotalElements()));
    }
    @Transactional(rollbackOn = Exception.class)
    void updateVariant(List<VariantComboRequest> variantRequests, List<ComboItem> comboItems,int comboId)
    {
        List<ComboItem> comboItemNews = new ArrayList<>();
        if (comboItems != null) {
            if (variantRequests != null) {
                for (val variantRq : variantRequests) {
                    var comboitem = mapper.map(variantRq, ComboItem.class);
                    //variant add
                    if (variantRq.getComboitemId() == 0) {
                        val variant = variantRepository.findById(variantRq.getVariantId());
                       comboitem.setComboId(comboId);
                       comboitem.setVariantId(variantRq.getVariantId());
                       comboitem.setQuantity(variantRq.getQuantity());
                       comboitem.setItemId(variant.get().getItemId());
                       comboitem.setStatus(1);
                       comboitem.setCreatedOn(CommonCode.getTimestamp());
                       comboitem.setModifiedOn(0);
                       comboItemRepository.save(comboitem);
                    } else {
                        //variant update
                        var comboitemOld = comboItems.stream().filter(v -> v.getId().equals(variantRq.getComboitemId())).collect(Collectors.toList()).stream().findFirst().orElse(null);
                        if (comboitemOld != null) {
                            comboitemOld.setModifiedOn(CommonCode.getTimestamp());
                            comboitemOld.setQuantity(variantRq.getQuantity());
                            comboItemNews.add(comboitemOld);
                        }
                    }
                }
                //Variant deleted
                for (var comboItem : comboItems) {
                    var variantDeleted = variantRequests.stream().filter(vq -> vq.getComboitemId() == comboItem.getId()).collect(Collectors.toList()).stream().findFirst();
                    if (!variantDeleted.isPresent() || variantDeleted.get() == null) {
                        comboItem.setModifiedOn(CommonCode.getTimestamp());
                        comboItem.setStatus(2);
                        comboItemNews.add(comboItem);
                    }
                }
            }
            if(comboItemNews != null && comboItemNews.size() != 0){
                comboItemRepository.saveAll(comboItemNews);
            }
        }
    }
}

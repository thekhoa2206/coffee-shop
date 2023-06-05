package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.order.*;
import com.hust.coffeeshop.models.entity.ComboItem;
import com.hust.coffeeshop.models.entity.ItemIngredient;
import com.hust.coffeeshop.models.entity.Order;
import com.hust.coffeeshop.models.entity.OrderItem;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.CustomerService;
import com.hust.coffeeshop.services.OrderService;
import com.hust.coffeeshop.services.ProductService;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final FilterRepository filterRepository;
    private final ModelMapper mapper;
    private final OrderItemRepository orderItemRepository;
    private final CustomerService customerService;
    private final ProductService productService;
    private final ComboRepository comboRepository;
    private final ComboItemRepository comboItemRepository;
    private final ItemIngredientRepository itemIngredientRepository;
    private final IngredientRepository ingredientRepository;
    private final VariantRepository variantRepository;

    public OrderServiceImpl(OrderRepository orderRepository, FilterRepository filterRepository, ModelMapper mapper, OrderItemRepository orderItemRepository, CustomerService customerService, ProductService productService, ComboRepository comboRepository, ComboItemRepository comboItemRepository, ItemIngredientRepository itemIngredientRepository, IngredientRepository ingredientRepository, VariantRepository variantRepository) {
        this.orderRepository = orderRepository;
        this.filterRepository = filterRepository;
        this.mapper = mapper;
        this.orderItemRepository = orderItemRepository;
        this.customerService = customerService;
        this.productService = productService;
        this.comboRepository = comboRepository;
        this.comboItemRepository = comboItemRepository;
        this.itemIngredientRepository = itemIngredientRepository;
        this.ingredientRepository = ingredientRepository;
        this.variantRepository = variantRepository;
    }
/*
* Coi 2 loại sản phẩm là combo và sp thường => khi bán hàng bán 2 loại sp là combo và sp thường(variant)
* product id là lưu 2 loại(combo_id với sp combo và variant_id với sp thường)
* */
    @Override
    public PagingListResponse<OrderResponse> filter(OrderFilterRequest filter) {
        if (filter.getQuery() != null) {
            var orders = orderRepository.findOrdersByQuery("%" + filter.getQuery() + "%");
            if (orders != null && orders.size() > 0) {
                var ids = orders.stream().map(o -> o.getId()).collect(Collectors.toList());
                filter.setIds(ids);
            } else {
                filter.setIds(new ArrayList<>());
            }
            filter.setQuery(null);
        }
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
        //status
        if (filter.getStatuses() != null && !filter.getStatuses().isEmpty()) {
            Filter statuses = Filter.builder()
                    .field("status")
                    .operator(QueryOperator.IN)
                    .values(Arrays.asList(filter.getStatuses().split(",")))
                    .build();
            filters.add(statuses);
        }
        Page<Order> results = null;
        List<OrderResponse> orderResponses = new ArrayList<>();
        try {
            if (filters.size() > 0)
                results = orderRepository.findAll(filterRepository.getSpecificationFromFilters(filters), pageable);
            else results = orderRepository.findAll(pageable);

            for (val item : results.getContent()) {
                var orderResponse = mapperOrderResponse(item);
                var customer = customerService.getById(item.getCustomerId());
                if (customer != null) {
                    orderResponse.setCustomerResponse(customer);
                }
                orderResponses.add(orderResponse);
            }
        } catch (Exception e) {
            orderResponses = new ArrayList<>();
        }
        return new PagingListResponse<>(
                orderResponses,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), results != null ? results.getTotalElements() : 0));
    }

    private OrderResponse mapperOrderResponse(Order order) {
        val orderResponse = mapper.map(order, OrderResponse.class);
        var orderItems = orderItemRepository.findOrderByOrderId(order.getId());
        List<OrderItemResponse> orderItemResponses = new ArrayList<>();
        for (var orderItem : orderItems) {
            var orderItemResponse = mapper.map(orderItem, OrderItemResponse.class);
            orderItemResponses.add(orderItemResponse);
        }
        orderResponse.setOrderItemResponses(orderItemResponses);
        return orderResponse;
    }

    @Override
    public OrderResponse create(OrderRequest request) {
        Order order = new Order();
        if (request.getOrderItemRequest() == null || request.getOrderItemRequest().size() == 0)
            throw new ErrorException("Đơn hàng phải có ít nhất 1 sp");

        if (request.getCustomerId() == 0)
            throw new ErrorException("Khách hàng không được để trống");


        var lastId = orderRepository.getLastOrderId();
        if (request.getCode() == null)
            order.setCode("DON" + (lastId + 1));
        else order.setCode(request.getCode());
        order.setStatus(CommonStatus.OrderStatus.DRAFT);
        order.setCreatedOn();
        order.setModifiedOn();
        order.setCreatedBy(1);
        order.setModifiedBy(1);
        order.setCustomerId(request.getCustomerId());
        order.setNote(request.getNote());
        order.setDiscount_total(request.getDiscountTotal() != null ? request.getDiscountTotal() : BigDecimal.ZERO);
        order.setTotal(order.getTotal());

        order = orderRepository.save(order);
        List<OrderItem> lineItems = new ArrayList<>();
        for (var item : request.getOrderItemRequest()) {
            checkAvailable(item);
            var lineItem = mapper.map(item, OrderItem.class);
            lineItem.setCreatedOn();
            lineItem.setModifiedOn();
            lineItem.setCreatedBy(1);
            lineItem.setModifiedBy(1);
            lineItem.setStatus(CommonStatus.OrderItemStatus.ACTIVE);
            lineItem.setOrderId(order.getId());
            lineItems.add(lineItem);
        }
        if (lineItems != null && lineItems.size() > 0) {
            orderItemRepository.saveAll(lineItems);
        }
        var orderResponse = mapperOrderResponse(order);
        return orderResponse;
    }

    //Hàm check có thể bán trừ kho
    private void checkAvailable(OrderItemRequest request) {
        if (request.isCombo()) {
            var combo = comboRepository.findById(request.getProductId());
            if (!combo.isPresent() || combo == null) throw new ErrorException("Không tìm thấy combo!");
            var comboItems = comboItemRepository.findComboItemByComboId(combo.get().getId());
            if (comboItems != null || comboItems.size() > 0) {
                var variantIds = comboItems.stream().map(ComboItem::getId).collect(Collectors.toList());
                var variants = variantRepository.findVariantByIds(variantIds);
                if (variantIds != null && variantIds.size() > 0) {
                    var itemIngredients = itemIngredientRepository.findItemIngredientByVariantIds(variantIds);
                    var itemIngredientIds = itemIngredients.stream().map(ItemIngredient::getIngredientId).collect(Collectors.toList());
                    var ingredients = ingredientRepository.findByIds(itemIngredientIds);
                    if (ingredients != null && ingredients.size() > 0) {
                        for (var ingredient : ingredients) {
                            var itemIngredient = itemIngredients
                                    .stream()
                                    .filter(i -> i.getIngredientId() == ingredient.getId())
                                    .collect(Collectors.toList())
                                    .stream()
                                    .findFirst()
                                    .orElse(null);
                            if(itemIngredient != null){
                                //số lượng, khối lượng bán đi
                                var amount = request.getQuantity()*itemIngredient.getAmountConsume();
                                if(ingredient.getQuantity() - amount < 0) throw new ErrorException("Nguyên liệu không đủ số lượng, khối lượng có thể bán!");
                                ingredient.setQuantity(ingredient.getQuantity() - amount);
                            }else {
                                throw new ErrorException("Không tìm thấy phiên bản mặt hàng!");
                            }
                        }
                    }
                } else {
                    throw new ErrorException("Không tìm thấy phiên bản mặt hàng!");
                }
            } else {
                throw new ErrorException("Không tìm thấy combo!");
            }
        } else {

        }
    }
}

package com.hust.coffeeshop.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hust.coffeeshop.common.*;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.ingredient.IngredientFilterRequest;
import com.hust.coffeeshop.models.dto.order.*;
import com.hust.coffeeshop.models.entity.*;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.CustomerService;
import com.hust.coffeeshop.services.IngredientService;
import com.hust.coffeeshop.services.OrderService;
import com.hust.coffeeshop.services.ProductService;
import freemarker.template.TemplateException;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
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
    private final IngredientService ingredientService;
    private final OrderItemComboRepository orderItemComboRepository;
    private final InventoryLogRepository inventoryLogRepository;

    public OrderServiceImpl(OrderRepository orderRepository, FilterRepository filterRepository, ModelMapper mapper, OrderItemRepository orderItemRepository, CustomerService customerService, ProductService productService, ComboRepository comboRepository, ComboItemRepository comboItemRepository, ItemIngredientRepository itemIngredientRepository, IngredientRepository ingredientRepository, VariantRepository variantRepository, IngredientService ingredientService, OrderItemComboRepository orderItemComboRepository, InventoryLogRepository inventoryLogRepository) {
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
        this.ingredientService = ingredientService;
        this.orderItemComboRepository = orderItemComboRepository;
        this.inventoryLogRepository = inventoryLogRepository;
    }

    /*
     * Coi 2 loại sản phẩm là combo và sp thường => khi bán hàng bán 2 loại sp là combo và sp thường(variant)
     * product id là lưu 2 loại(combo_id với sp combo và variant_id với sp thường)
     * */
    @Override
    public PagingListResponse<OrderResponse> filter(OrderFilterRequest filter) throws ParseException {
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
        //payment_status
        if (filter.getPaymentStatus() != null && !filter.getPaymentStatus().isEmpty()) {
            Filter statuses = Filter.builder()
                    .field("paymentStatus")
                    .operator(QueryOperator.IN)
                    .values(Arrays.asList(filter.getPaymentStatus().split(",")))
                    .build();
            filters.add(statuses);
        }
        //createdOn
        if (filter.getCreatedOnMin() != null && !filter.getCreatedOnMin().isEmpty()) {
            Filter createdOnMin = Filter.builder()
                    .field("createdOn")
                    .operator(QueryOperator.GREATER_THAN)
                    .value(String.valueOf((CommonCode.getMilliSeconds(filter.getCreatedOnMin(), "yyyy-MM-dd'T'HH:mm:ss'Z'") + 25200000)))
                    .build();
            filters.add(createdOnMin);
        }
        if (filter.getCreatedOnMax() != null && !filter.getCreatedOnMax().isEmpty()) {
            Filter createdOnMax = Filter.builder()
                    .field("createdOn")
                    .operator(QueryOperator.LESS_THAN)
                    .value(String.valueOf((CommonCode.getMilliSeconds(filter.getCreatedOnMax(), "yyyy-MM-dd'T'HH:mm:ss'Z'") + 25200000)))
                    .build();
            filters.add(createdOnMax);
        }
        //modified
        if (filter.getModifiedOnMin() != null && !filter.getModifiedOnMin().isEmpty()) {
            Filter modifiedOn = Filter.builder()
                    .field("modifiedOn")
                    .operator(QueryOperator.GREATER_THAN)
                    .value(String.valueOf((CommonCode.getMilliSeconds(filter.getModifiedOnMin(), "yyyy-MM-dd'T'HH:mm:ss'Z'")  + 25200000)))
                    .build();
            filters.add(modifiedOn);
        }
        if (filter.getModifiedOnMax() != null && !filter.getModifiedOnMax().isEmpty()) {
            Filter modifiedOn = Filter.builder()
                    .field("modifiedOn")
                    .operator(QueryOperator.LESS_THAN)
                    .value(String.valueOf((CommonCode.getMilliSeconds(filter.getModifiedOnMax(), "yyyy-MM-dd'T'HH:mm:ss'Z'")+ 25200000)))
                    .build();
            filters.add(modifiedOn);
        }

        Page<Order> results = null;
        List<OrderResponse> orderResponses = new ArrayList<>();
        try {
            if (filters.size() > 0)
                results = orderRepository.findAll(filterRepository.getSpecificationFromFilters(filters), pageable);
            else results = orderRepository.findAll(pageable);
            for (val item : results.getContent()) {
                var orderResponse = mapperOrderResponse(item);
                orderResponses.add(orderResponse);
            }
        } catch (Exception e) {
            orderResponses = new ArrayList<>();
        }
        return new PagingListResponse<>(
                orderResponses,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), results != null ? results.getTotalElements() : 0));
    }

    //Hàm mapper order => orderResponse để trả về
    private OrderResponse mapperOrderResponse(Order order) {
        val orderResponse = mapper.map(order, OrderResponse.class);
        var customer = customerService.getById(order.getCustomerId());
        if (customer != null) {
            orderResponse.setCustomerResponse(customer);
        }
        var orderItems = orderItemRepository.findOrderItemByOrderId(order.getId());
        List<OrderItemResponse> orderItemResponses = new ArrayList<>();
        for (var orderItem : orderItems) {
            var orderItemResponse = mapper.map(orderItem, OrderItemResponse.class);
            if (orderItem.isCombo()) {
                var orderCombos = orderItemComboRepository.findOrderItemComboByOrderItemId(orderItem.getId());
                List<OrderItemComboResponse> orderItemComboResponses = new ArrayList<>();
                if (orderCombos != null && orderCombos.size() > 0) {
                    for (var orderItemCombo : orderCombos) {
                        var orderItemComboResponse = mapper.map(orderItemCombo, OrderItemComboResponse.class);
                        orderItemComboResponses.add(orderItemComboResponse);
                    }
                }
                orderItemResponse.setOrderItemComboResponses(orderItemComboResponses);
            }
            orderItemResponses.add(orderItemResponse);
        }
        orderResponse.setOrderItemResponses(orderItemResponses);
        return orderResponse;
    }

    //Hàm tạo đơn hàng
    @Override
    @Transactional(rollbackOn = Exception.class)
    public OrderResponse create(OrderRequest request) {
        Order order = new Order();
        InventoryLog inventoryLog = new InventoryLog();
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
        order.setCreatedBy("admin");
        order.setModifiedBy("admin");
        order.setCustomerId(request.getCustomerId());
        order.setNote(request.getNote());
        order.setDiscountTotal(request.getDiscountTotal() != null ? request.getDiscountTotal() : BigDecimal.ZERO);
        order.setTotal(request.getTotal());
        order.setPaymentStatus(CommonStatus.PaymentStatus.UNPAID);
        order = orderRepository.save(order);
        for (var item : request.getOrderItemRequest()) {
            var lineItem = mapper.map(item, OrderItem.class);
            lineItem.setOrderId(order.getId());
            checkAvailable(item);
            lineItem.setCreatedOn();
            lineItem.setModifiedOn();
            lineItem.setCreatedBy("admin");
            lineItem.setModifiedBy("admin");
            lineItem.setStatus(CommonStatus.OrderItemStatus.ACTIVE);
            lineItem = orderItemRepository.save(lineItem);
            if(lineItem.isCombo()){
                var combo = comboRepository.findById(lineItem.getProductId());
                if (!combo.isPresent() || combo == null) throw new ErrorException("Không tìm thấy combo!");
                var comboItems = comboItemRepository.findComboItemByComboId(combo.get().getId());
                if (comboItems != null || comboItems.size() > 0) {
                    var variantIds = comboItems.stream().map(ComboItem::getVariantId).collect(Collectors.toList());
                    var variants = variantRepository.findVariantByIds(variantIds);
                    for (var comboItem : comboItems) {
                        var variant = variants.stream().filter(v -> v.getId() == comboItem.getVariantId()).collect(Collectors.toList()).stream().findFirst().orElse(null);
                        OrderItemCombo orderItemCombo = new OrderItemCombo();
                        orderItemCombo.setOrderId(order.getId());
                        orderItemCombo.setOrderItemId(lineItem.getId());
                        orderItemCombo.setName(variant.getName());
                        orderItemCombo.setPrice(variant.getPrice());
                        orderItemCombo.setQuantity(comboItem.getQuantity() * lineItem.getQuantity());
                        orderItemCombo.setStatus(CommonStatus.Status.ACTIVE);
                        orderItemCombo.setCreatedOn();
                        orderItemCombo.setModifiedOn();
                        orderItemCombo.setCreatedBy("admin");
                        orderItemCombo.setModifiedBy("admin");
                        orderItemCombo.setVariantId(variant.getId());
                        orderItemCombo.setComboItemId(comboItem.getId());
                        orderItemComboRepository.save(orderItemCombo);
                    }
                }
            }
        }
        var orderResponse = mapperOrderResponse(order);
        saveinventory(orderResponse, CommonStatus.Status.ACTIVE);
        return orderResponse;
    }

    //Hàm check có thể bán trừ kho
    private void checkAvailable(OrderItemRequest request) {
        if (request.isCombo()) {
            var combo = comboRepository.findById(request.getProductId());
            if (!combo.isPresent() || combo == null) throw new ErrorException("Không tìm thấy combo!");
            var comboItems = comboItemRepository.findComboItemByComboId(combo.get().getId());
            if (comboItems != null || comboItems.size() > 0) {
                var variantIds = comboItems.stream().map(ComboItem::getVariantId).collect(Collectors.toList());
                var variants = variantRepository.findVariantByIds(variantIds);
                if (variantIds != null && variantIds.size() > 0) {
                    setIngredient(variantIds, request);
                } else {
                    throw new ErrorException("Không tìm thấy phiên bản mặt hàng!");
                }
            } else {
                throw new ErrorException("Không tìm thấy combo!");
            }
        } else {
            var variantId = request.getProductId();
            List<Integer> variantIds = new ArrayList<>();
            variantIds.add(variantId);
            setIngredient(variantIds, request);
        }
    }

    //Hàm trừ nguyên liệu
    private void setIngredient(List<Integer> variantIds, OrderItemRequest request) {
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
                if (itemIngredient != null) {
                    //số lượng, khối lượng bán đi
                    var amount = request.getQuantity() * itemIngredient.getAmountConsume();
                    if (ingredient.getQuantity() - amount < 0)
                        throw new ErrorException("Nguyên liệu không đủ số lượng, khối lượng có thể bán!");
                    ingredient.setQuantity(ingredient.getQuantity() - amount);
                    ingredientRepository.save(ingredient);
                } else {
                    throw new ErrorException("Không tìm thấy phiên bản mặt hàng!");
                }
            }
        }
    }

    //Hàm get đơn hàng bằng Id
    @Override
    public OrderResponse getById(int id) {
        if (id == 0) throw new ErrorException("Không có id đơn hàng");
        var order = orderRepository.findById(id);
        if (!order.isPresent()) throw new ErrorException("Không tìm thấy thông tin đơn hàng");
        var orderResponse = mapperOrderResponse(order.get());

        return orderResponse;
    }

    //Hàm Thanh toán cho đơn hàng
    @Override
    public OrderResponse addPayment(int id) {
        if (id == 0) throw new ErrorException("Không có id đơn hàng");
        var order = orderRepository.findById(id);
        if (!order.isPresent()) throw new ErrorException("Không tìm thấy thông tin đơn hàng");
        if (order.get().getPaymentStatus() == CommonStatus.PaymentStatus.PAID)
            throw new ErrorException("Đơn hàng đã thanh toán");
        if (order.get().getStatus() == CommonStatus.OrderStatus.DELETED)
            throw new ErrorException("Đơn hàng đã hủy không thể thanh toán");
        order.get().setPaymentStatus(CommonStatus.PaymentStatus.PAID);
        order.get().setModifiedOn();
        var orderNew = orderRepository.save(order.get());
        var orderResponse = mapperOrderResponse(orderNew);
        var customer = customerService.getById(orderNew.getCustomerId());
        if (customer != null) {
            orderResponse.setCustomerResponse(customer);
        }
        return orderResponse;
    }

    //Hàm cập nhật đơn hàng
    @Override
    @Transactional
    public OrderResponse update(OrderRequest request, int id) {
        if (id == 0) throw new ErrorException("Không có id đơn hàng");
        var order = orderRepository.findById(id);
        if (!order.isPresent()) throw new ErrorException("Không tìm thấy thông tin đơn hàng");
        var orderNew = order.get();
        List<OrderItemResponse> lineItems = new ArrayList<>();
        orderNew.setNote(request.getNote());
        orderNew.setModifiedOn();
        if (orderNew.getStatus() == CommonStatus.OrderStatus.DRAFT) {
            orderNew.setTotal(request.getTotal());
            orderNew.setCode(request.getCode());
            orderNew.setDiscountTotal(request.getDiscountTotal());
            orderNew.setCustomerId(request.getCustomerId());
            lineItems = setOrderItems(request.getOrderItemRequest(), id);
        }
        var orderResponse = mapperOrderResponse(orderNew);
        if (lineItems != null && lineItems.size() > 0) {
            orderResponse.setOrderItemResponses(lineItems);
        }
        orderRepository.save(orderNew);
        return orderResponse;
    }

    //Hàm cập nhật lineItem cho đơn hàng
    @Transactional
    public List<OrderItemResponse> setOrderItems(List<OrderItemRequest> requests, int orderId) {
        /*
         * cập nhật đơn chia làm 3 trường hợp(2 list lineItem của đơn - list 1 request, list 2 đã lưu ở database)
         * TH1: tạo mới item: item có id = 0 ở request
         * TH2: update item: item có id ở cả 2 list
         * TH3: xóa item: item chỉ có id trong list 2,
         * */
        List<OrderItemResponse> itemResponses = new ArrayList<>();
        var orderItems = orderItemRepository.findOrderItemByOrderId(orderId);
        for (var itemNew : requests) {

            //Tạo
            if (itemNew.getId() == 0) {
                var item = mapper.map(itemNew, OrderItem.class);
                item.setOrderId(orderId);
                item.setModifiedOn();
                item.setCreatedBy("admin");
                item.setModifiedBy("admin");
                item.setCreatedOn();
                item.setStatus(CommonStatus.OrderItemStatus.ACTIVE);
                checkInventoryUpdate(itemNew, TypeAction.ADD, null);
                item = orderItemRepository.save(item);
                var orderItemCombos = setOrderItemCombo(item, TypeAction.ADD);
                OrderItemResponse itemResponse = mapper.map(item, OrderItemResponse.class);
                itemResponse.setOrderItemComboResponses(orderItemCombos);
                itemResponses.add(itemResponse);

            } else {
                //Sửa
                var itemOld = orderItems.stream().filter(i -> i.getId() == itemNew.getId())
                        .collect(Collectors.toList()).stream().findFirst().orElse(null);
                if (itemOld != null) {
                    checkInventoryUpdate(itemNew, TypeAction.UPDATE, itemOld);
                    itemOld.setName(itemNew.getName());
                    itemOld.setPrice(itemNew.getPrice());
                    itemOld.setCombo(itemNew.isCombo());
                    itemOld.setOrderId(orderId);
                    itemOld.setQuantity(itemNew.getQuantity());
                    itemOld.setModifiedOn();
                    OrderItemResponse itemResponse = mapper.map(itemOld, OrderItemResponse.class);
                    itemResponses.add(itemResponse);
                    var orderItemCombos = setOrderItemCombo(itemOld, TypeAction.UPDATE);
                    itemResponse.setOrderItemComboResponses(orderItemCombos);
                    orderItemRepository.save(itemOld);
                }
            }

            for (var item : orderItems) {
                var itemDeleted = orderItems.stream().filter(i -> i.getId() == item.getId())
                        .collect(Collectors.toList())
                        .stream().findFirst().orElse(null);
                if (itemDeleted == null) {
                    item.setStatus(CommonStatus.OrderItemStatus.DELETED);
                    item.setModifiedOn();
                    checkInventoryUpdate(null, TypeAction.DELETED, item);
                    setOrderItemCombo(item, TypeAction.DELETED);
                    orderItemRepository.save(item);
                }
            }
        }
        return itemResponses;
    }

    //Hàm set orderItemCombo
    private List<OrderItemComboResponse> setOrderItemCombo(OrderItem lineItem, TypeAction type) {
        List<OrderItemComboResponse> orderItemComboResponses = new ArrayList<>();
        var combo = comboRepository.findById(lineItem.getProductId());
        if (!combo.isPresent() || combo == null) throw new ErrorException("Không tìm thấy combo!");
        var comboItems = comboItemRepository.findComboItemByComboId(combo.get().getId());
        if (type.equals(TypeAction.ADD)) {
            if (comboItems != null || comboItems.size() > 0) {
                var variantIds = comboItems.stream().map(ComboItem::getVariantId).collect(Collectors.toList());
                var variants = variantRepository.findVariantByIds(variantIds);
                for (var comboItem : comboItems) {
                    var variant = variants.stream().filter(v -> v.getId() == comboItem.getVariantId()).collect(Collectors.toList()).stream().findFirst().orElse(null);
                    OrderItemCombo orderItemCombo = new OrderItemCombo();
                    orderItemCombo.setOrderId(lineItem.getOrderId());
                    orderItemCombo.setOrderItemId(lineItem.getId());
                    orderItemCombo.setName(variant.getName());
                    orderItemCombo.setPrice(variant.getPrice());
                    orderItemCombo.setQuantity(comboItem.getQuantity());
                    orderItemCombo.setStatus(CommonStatus.Status.ACTIVE);
                    orderItemCombo.setCreatedOn();
                    orderItemCombo.setModifiedOn();
                    orderItemCombo.setCreatedBy("admin");
                    orderItemCombo.setModifiedBy("admin");
                    orderItemCombo.setComboItemId(comboItem.getId());
                    orderItemCombo.setVariantId(variant.getId());
                    orderItemCombo = orderItemComboRepository.save(orderItemCombo);
                    var orderItemComboResponse = mapper.map(orderItemCombo, OrderItemComboResponse.class);
                    orderItemComboResponses.add(orderItemComboResponse);
                }
            }
        } else if (type.equals(TypeAction.UPDATE)) {
            var orderItemCombos = orderItemComboRepository.findOrderItemComboByOrderItemId(lineItem.getId());
            if (orderItemCombos != null && orderItemCombos.size() > 0) {
                for (var orderItemCombo : orderItemCombos) {
                    orderItemCombo.setModifiedOn();
                    orderItemCombo = orderItemComboRepository.save(orderItemCombo);
                    var orderItemComboResponse = mapper.map(orderItemCombo, OrderItemComboResponse.class);
                    orderItemComboResponses.add(orderItemComboResponse);
                }
            }
        } else if (type.equals(TypeAction.DELETED)) {
            var orderItemCombos = orderItemComboRepository.findOrderItemComboByOrderItemId(lineItem.getId());
            if (orderItemCombos != null && orderItemCombos.size() > 0) {
                for (var orderItemCombo : orderItemCombos) {
                    orderItemCombo.setStatus(CommonStatus.Status.DELETED);
                    orderItemCombo.setModifiedOn();
                    orderItemComboRepository.save(orderItemCombo);
                }
            }
        }
        return orderItemComboResponses;
    }

    //Hàm sửa tồn kho khi sửa đơn hàng
    private void checkInventoryUpdate(OrderItemRequest itemNew, TypeAction type, OrderItem itemOld) {
        //Sửa tồn khi thêm sp
        /*
         * - Với sản phẩm là combo => tìm kiếm nguyên liệu thuộc variant của combo và update lại tồn kho,
         * - Với sản phẩm là sp thường => tìm kiếm nguyên liệu thuộc variant và update lại tồn
         * */
        if (type.equals(TypeAction.ADD) && itemNew != null) {
            checkAvailable(itemNew);
        } else if (type.equals(TypeAction.UPDATE) && itemNew != null && itemOld != null) {
            /*
             * Sửa tồn kho của nguyên liệu khi update sản phẩm
             * */
            if (itemNew.isCombo()) {
                var combo = comboRepository.findById(itemNew.getProductId());
                if (!combo.isPresent() || combo == null) throw new ErrorException("Không tìm thấy combo!");
                var comboItems = comboItemRepository.findComboItemByComboId(combo.get().getId());
                if (comboItems != null || comboItems.size() > 0) {
                    var variantIds = comboItems.stream().map(ComboItem::getVariantId).collect(Collectors.toList());
                    if (variantIds != null && variantIds.size() > 0) {
                        List<InventoryVariant> inventoryVariants = new ArrayList<>();
                        for (var variantId : variantIds) {
                            InventoryVariant inventoryVariant = new InventoryVariant();
                            inventoryVariant.setVariantId(variantId);
                            inventoryVariant.setQuantity(itemOld.getQuantity() - itemNew.getQuantity());
                            inventoryVariants.add(inventoryVariant);
                        }
                        changeInventory(inventoryVariants);
                    } else {
                        throw new ErrorException("Không tìm thấy phiên bản mặt hàng!");
                    }
                } else {
                    throw new ErrorException("Không tìm thấy combo!");
                }
            } else {
                var variantId = itemNew.getProductId();
                List<InventoryVariant> inventoryVariants = new ArrayList<>();
                InventoryVariant inventoryVariant = new InventoryVariant();
                inventoryVariant.setVariantId(variantId);
                inventoryVariant.setQuantity(itemOld.getQuantity() - itemNew.getQuantity());
                inventoryVariants.add(inventoryVariant);
                changeInventory(inventoryVariants);
            }
        } else if (type.equals(TypeAction.DELETED) && itemOld != null) {
            if (itemOld.isCombo()) {
                var combo = comboRepository.findById(itemOld.getProductId());
                if (!combo.isPresent() || combo == null) throw new ErrorException("Không tìm thấy combo!");
                var comboItems = comboItemRepository.findComboItemByComboId(combo.get().getId());
                if (comboItems != null || comboItems.size() > 0) {
                    var variantIds = comboItems.stream().map(ComboItem::getVariantId).collect(Collectors.toList());
                    if (variantIds != null && variantIds.size() > 0) {
                        List<InventoryVariant> inventoryVariants = new ArrayList<>();
                        for (var variantId : variantIds) {
                            InventoryVariant inventoryVariant = new InventoryVariant();
                            inventoryVariant.setVariantId(variantId);
                            inventoryVariant.setQuantity(itemOld.getQuantity());
                            inventoryVariants.add(inventoryVariant);
                        }
                        changeInventory(inventoryVariants);
                    } else {
                        throw new ErrorException("Không tìm thấy phiên bản mặt hàng!");
                    }
                } else {
                    throw new ErrorException("Không tìm thấy combo!");
                }
            } else {
                var variantId = itemOld.getProductId();
                List<InventoryVariant> inventoryVariants = new ArrayList<>();
                InventoryVariant inventoryVariant = new InventoryVariant();
                inventoryVariant.setVariantId(variantId);
                inventoryVariant.setQuantity(itemOld.getQuantity());
                inventoryVariants.add(inventoryVariant);
                changeInventory(inventoryVariants);
            }
        }
    }

    //Hàm thay đổi kho
    private void changeInventory(List<InventoryVariant> inventoryVariants) {
        if (inventoryVariants != null && inventoryVariants.size() > 0) {
            for (var inventory : inventoryVariants) {
                List<Integer> variantIds = new ArrayList<>();
                variantIds.add(inventory.getVariantId());
                Page<Ingredient> ingredients = null;
                if (variantIds != null && variantIds.size() > 0) {
                    IngredientFilterRequest filter = new IngredientFilterRequest();
                    filter.setVariantIds(variantIds);
                    ingredients = ingredientService.filterIngredient(filter);
                }
                if (ingredients != null) {
                    for (var ingredient : ingredients) {
                        ingredient.setQuantity(ingredient.getQuantity() + inventory.getQuantity());
                        ingredient.setModifiedOn();
                        ingredientRepository.save(ingredient);
                    }
                }

            }
        }
    }

    @Override
    public OrderResponse updateStatus(int id, int status) {
        if (id == 0) throw new ErrorException("Không có id đơn hàng");
        var order = orderRepository.findById(id);
        if (!order.isPresent()) throw new ErrorException("Không tìm thấy thông tin đơn hàng");
        if ((order.get().getStatus() != CommonStatus.OrderStatus.DRAFT
                && order.get().getStatus() != CommonStatus.PaymentStatus.PAID) && status == CommonStatus.OrderStatus.DELETED) {
            throw new ErrorException("Đơn hàng không được hủy!");
        }
        if (status == CommonStatus.OrderStatus.COMPLETED && order.get().getStatus() == CommonStatus.OrderStatus.DELETED) {
            throw new ErrorException("Đơn hàng đã hủy không thể hoàn thành!");
        }
        if (order.get().getStatus() == CommonStatus.OrderStatus.DELETED) {
            throw new ErrorException("Đơn hàng đã hủy không thể thực hiện!");
        }
        if (order.get().getStatus() == CommonStatus.OrderStatus.COMPLETED) {
            throw new ErrorException("Đơn hàng đã hoàn thành không thể thực hiện hành động này!");
        }
        order.get().setStatus(status);
        order.get().setModifiedOn();
        orderRepository.save(order.get());
        var orderResponse = mapperOrderResponse(order.get());
        if(status ==CommonStatus.OrderStatus.DELETED){
            saveinventory(orderResponse,status);
        }
        return orderResponse;
    }

    //Hàm in đơn hàng
    @Override
    public OrderPrintForm getPrintForm(PrintOrderRequest printOrder) throws IOException, TemplateException {
        String htmlContent = null;
        if (printOrder.getOrderId() != 0) {
            val printSample = PrintSample.CONTENT_HTML;
            val order = orderRepository.findById(printOrder.getOrderId());
            if (order != null && printSample != null) {
                val orderPrintModel = mapperOrderPrintModel(order.get());
                orderPrintModel.setForPrintForm();
                htmlContent = PrintUtils.process(printSample, orderPrintModel, PrintVariableMap.ORDER);
            }
        }
        return new OrderPrintForm(printOrder.getOrderId(), htmlContent);
    }

    //Hàm map dữ liệu từ order => orderModel để in đơn hàng
    private OrderPrintModel mapperOrderPrintModel(Order order) {
        OrderPrintModel model = new OrderPrintModel();
        model.setCode(order.getCode());
        model.setCreatedOn(order.getCreatedOn());
        model.setCreatedOn(order.getModifiedOn());
        model.setDiscountTotal(order.getDiscountTotal());
        model.setTotal(order.getTotal());
        model.setNote(order.getNote());
        model.setPaymentStatus(order.getPaymentStatus());
        model.setStatus(order.getStatus());
        var customer = customerService.getById(order.getCustomerId());
        if (customer != null) {
            OrderPrintModel.CustomerPrintModel customerPrintModel = new OrderPrintModel.CustomerPrintModel();
            customerPrintModel.setId(customer.getId());
            customerPrintModel.setName(customer.getName());
            customerPrintModel.setPhone(customer.getPhoneNumber());
            model.setCustomer(customerPrintModel);
        }
        var lineItems = orderItemRepository.findOrderItemByOrderId(order.getId());
        if (lineItems != null) {
            List<OrderPrintModel.OrderItemPrintModel> itemModels = new ArrayList<>();
            for (var lineItem : lineItems) {
                OrderPrintModel.OrderItemPrintModel itemModel = new OrderPrintModel.OrderItemPrintModel();
                itemModel.setId(lineItem.getId());
                itemModel.setLineAmount(lineItem.getPrice().multiply(BigDecimal.valueOf(lineItem.getQuantity())));
                itemModel.setCombo(lineItem.isCombo());
                itemModel.setProductId(lineItem.getProductId());
                itemModel.setQuantity(lineItem.getQuantity());
                itemModel.setPrice(lineItem.getPrice());
                itemModel.setStatus(lineItem.getStatus());
                itemModel.setName(lineItem.getName());
                if(itemModel.isCombo()){
                    List<OrderPrintModel.OrderVariantComboPrintModel> variantModels = new ArrayList<>();
                    var itemCombos = orderItemComboRepository.findOrderItemComboByOrderItemId(itemModel.getId());
                    for (var itemCombo: itemCombos) {
                        OrderPrintModel.OrderVariantComboPrintModel variantModel = new OrderPrintModel.OrderVariantComboPrintModel();
                        variantModel.setId(itemCombo.getId());
                        variantModel.setPrice(itemCombo.getPrice());
                        variantModel.setName(itemCombo.getName());
                        variantModel.setQuantity(itemCombo.getQuantity());
                        variantModels.add(variantModel);
                    }
                    itemModel.setItemCombos(variantModels);
                }
                itemModels.add(itemModel);
            }
            model.setLineItems(itemModels);
        }
        model.setForPrintForm();
        return model;
    }

    //Hàm save and log inventory
    private void saveinventory(OrderResponse order,int status) {
        if(order.getOrderItemResponses().size()>0){
            for(val oderItem : order.getOrderItemResponses())
            {
                if(oderItem.isCombo()){
                    for (val dataCombo :oderItem.getOrderItemComboResponses()){
                        val itemIngredient = itemIngredientRepository.findItemIngredientByVariantId(dataCombo.getVariantId());
                        for(val dataIngredient : itemIngredient){
                            val ingredient = ingredientRepository.findById(dataIngredient.getIngredientId());
                            Integer changerAmount  = 0;
                            changerAmount = dataIngredient.getAmountConsume()*dataCombo.getQuantity();
                            if(status != CommonStatus.OrderStatus.DELETED){
                                InventoryLog inventoryLog = new InventoryLog();
                                //lưu vào bảng log kho
                                inventoryLog.setCode(order.getCode());
                                inventoryLog.setObjectId(order.getId());
                                inventoryLog.setNote(order.getNote());
                                inventoryLog.setCreatedOn(CommonCode.getTimestamp());
                                inventoryLog.setModifiedOn(0);
                                inventoryLog.setType("order");
                                inventoryLog.setIngredientId(ingredient.get().getId());
                                inventoryLog.setStockRemain(ingredient.get().getQuantity());
                            inventoryLog.setAmountChargeInUnit("-"+changerAmount);
                            inventoryLog.setStatus(1);
                            inventoryLogRepository.save(inventoryLog);
                            }
                            else {
                                InventoryLog inventoryLog = new InventoryLog();
                                //lưu vào bảng log kho
                                inventoryLog.setCode(order.getCode());
                                inventoryLog.setObjectId(order.getId());
                                inventoryLog.setNote(order.getNote());
                                inventoryLog.setCreatedOn(CommonCode.getTimestamp());
                                inventoryLog.setModifiedOn(0);
                                inventoryLog.setType("order");
                                inventoryLog.setIngredientId(ingredient.get().getId());
                                inventoryLog.setStockRemain(ingredient.get().getQuantity());
                                inventoryLog.setAmountChargeInUnit("+"+changerAmount);
                                inventoryLog.setStatus(2);
                                inventoryLogRepository.save(inventoryLog);
                            }
                        }
                    }
                }
                else {
                    val itemIngredient = itemIngredientRepository.findItemIngredientByVariantId(oderItem.getProductId());
                    for(val dataIngredient : itemIngredient){
                        val ingredient = ingredientRepository.findById(dataIngredient.getIngredientId());
                        Integer changerAmount  = 0;
                        changerAmount = dataIngredient.getAmountConsume()*oderItem.getQuantity();
                        if(status != CommonStatus.OrderStatus.DELETED){
                            InventoryLog inventoryLog = new InventoryLog();
                            //lưu vào bảng log kho
                            inventoryLog.setCode(order.getCode());
                            inventoryLog.setObjectId(order.getId());
                            inventoryLog.setNote(order.getNote());
                            inventoryLog.setCreatedOn(CommonCode.getTimestamp());
                            inventoryLog.setModifiedOn(0);
                            inventoryLog.setType("order");
                            inventoryLog.setIngredientId(ingredient.get().getId());
                            inventoryLog.setStockRemain(ingredient.get().getQuantity());
                            inventoryLog.setAmountChargeInUnit("-"+changerAmount);
                            inventoryLog.setStatus(1);
                            inventoryLogRepository.save(inventoryLog);
                        }
                        else {
                            InventoryLog inventoryLog = new InventoryLog();
                            //lưu vào bảng log kho
                            inventoryLog.setCode(order.getCode());
                            inventoryLog.setObjectId(order.getId());
                            inventoryLog.setNote(order.getNote());
                            inventoryLog.setCreatedOn(CommonCode.getTimestamp());
                            inventoryLog.setModifiedOn(0);
                            inventoryLog.setType("order");
                            inventoryLog.setIngredientId(ingredient.get().getId());
                            inventoryLog.setStockRemain(ingredient.get().getQuantity());
                            inventoryLog.setAmountChargeInUnit("+"+changerAmount);
                            inventoryLog.setStatus(2);
                            inventoryLogRepository.save(inventoryLog);
                        }
                    }
                }
            }
        }
    }
}


package com.coffeeshop.order.services.impl;

import com.coffeeshop.order.clients.CustomerClient;
import com.coffeeshop.order.common.*;
import com.coffeeshop.order.models.dto.PagingListResponse;
import com.coffeeshop.order.models.dto.order.*;
import com.coffeeshop.order.models.entity.Order;
import com.coffeeshop.order.models.exception.ErrorException;
import com.coffeeshop.order.models.repository.*;
import com.coffeeshop.order.services.OrderService;
import freemarker.template.TemplateException;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
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
    private final OrderItemComboRepository orderItemComboRepository;
    private final CustomerClient customerClient;
    public OrderServiceImpl(OrderRepository orderRepository, FilterRepository filterRepository, ModelMapper mapper, OrderItemRepository orderItemRepository, OrderItemComboRepository orderItemComboRepository, CustomerClient customerClient) {
        this.orderRepository = orderRepository;
        this.filterRepository = filterRepository;
        this.mapper = mapper;
        this.orderItemRepository = orderItemRepository;
        this.orderItemComboRepository = orderItemComboRepository;
        this.customerClient = customerClient;
    }

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
        var customer = customerClient.getById(order.getCustomerId());
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
        var customer = customerClient.getById(order.getCustomerId());
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
        // Dùng saga
//        if(status ==CommonStatus.OrderStatus.DELETED){
//            saveinventory(orderResponse,status);
//        }
        return orderResponse;
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
}

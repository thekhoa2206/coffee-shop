package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.order.OrderFilterRequest;
import com.hust.coffeeshop.models.dto.order.OrderResponse;
import com.hust.coffeeshop.models.dto.table.*;
import com.hust.coffeeshop.models.entity.Table;
import com.hust.coffeeshop.models.entity.TableOrder;
import com.hust.coffeeshop.models.exception.BaseException;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.OrderService;
import com.hust.coffeeshop.services.TableService;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TableServiceImpl implements TableService {
    private final ModelMapper mapper;
    private final TableRepository tableRepository;
    private final FilterRepository filterRepository;
    private final TableOrderRepository tableOrderRepository;
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    public TableServiceImpl(ModelMapper mapper, TableRepository tableRepository, FilterRepository filterRepository, TableOrderRepository tableOrderRepository, OrderRepository orderRepository, OrderService orderService) {
        this.mapper = mapper;
        this.tableRepository = tableRepository;
        this.filterRepository = filterRepository;
        this.tableOrderRepository = tableOrderRepository;
        this.orderRepository = orderRepository;
        this.orderService = orderService;
    }

    @Override
    public TableResponse create(TableRequest request) {
        if (request.getName() == null) throw new ErrorException("Tên bàn không được để trống");
        Table table = mapper.map(request, Table.class);
        table.setStatus(CommonStatus.Status.EMPTY);
        table.setCreatedOn(CommonCode.getTimestamp());
        table.setModifiedOn(0);
        TableResponse tableResponse = null;
        try {
            var tableNew = tableRepository.save(table);
            tableResponse = mapper.map(tableNew, TableResponse.class);
        } catch (Exception e) {
            throw new ErrorException("Tạo khách hàng thất bại");
        }
        return tableResponse;

    }

    @Override
    public TableResponse getbyid(int id) {
        val table = tableRepository.findById(id);
        if (!table.isPresent()) throw new ErrorException("không tìm kiếm thấy bàn");
        TableResponse tableResponse = null;
        tableResponse = mapper.map(table.get(), TableResponse.class);
        if (table.get().getStatus() == 1) {
            val tableOrders = tableOrderRepository.findByTableId(id);
            if (tableOrders == null) throw new ErrorException("không tìm kiếm thấy đơn trên cùng bàn");
            tableResponse.setOrderId(tableOrders.get(0).getOrder_Id());
        }
        return tableResponse;
    }

    @Override
    public TableResponse update(TableRequest request, int id) {
        val table = tableRepository.findById(id);
        if (!table.isPresent()) throw new ErrorException("không tìm kiếm thấy bàn");
        if (request.getName() != null) table.get().setName(request.getName());
        if (request.getStatus() != 0) table.get().setStatus(request.getStatus());
        table.get().setModifiedOn(CommonCode.getTimestamp());
        TableResponse tableResponse = null;
        try {
            var tableNew = tableRepository.save(table.get());
            tableResponse = mapper.map(tableNew, TableResponse.class);
        } catch (Exception e) {
            throw new ErrorException("cập nhập thông tin bàn thất bại");
        }
        return tableResponse;

    }

    @Override
    public void delete(int id) {
        val table = tableRepository.findById(id);
        if (!table.isPresent()) throw new ErrorException("không tìm kiếm thấy bàn");
        table.get().setStatus(CommonStatus.Status.DELETED);
        table.get().setModifiedOn(CommonCode.getTimestamp());

        try {
            var tableNew = tableRepository.save(table.get());
        } catch (Exception e) {
            throw new ErrorException("xoá bàn thất bại");
        }

    }

    @Override
    public PagingListResponse<TableResponse> filter(TableFilterRequest filter) {
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
        Page<Table> results;
        if (filters.size() > 0)
            results = tableRepository.findAll(filterRepository.getSpecificationFromFilters(filters), pageable);
        else results = tableRepository.findAll(pageable);
        List<TableResponse> tableResponses = new ArrayList<>();
        for (val tables : results.getContent()
        ) {
            val tableResponse = mapper.map(tables, TableResponse.class);
            if (tables.getStatus() == 1) {
                val tableOrders = tableOrderRepository.findByTableId(tables.getId());
                if (tableOrders == null) throw new ErrorException("không tìm kiếm thấy đơn trên cùng bàn");
                tableResponse.setOrderId(tableOrders.get(0).getOrder_Id());
            }
            if (tableResponse.getStatus() != 2) {
                tableResponses.add(tableResponse);
            }
        }

        return new PagingListResponse<>(
                tableResponses,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), results.getTotalElements()));
    }

    @Override
    @Transactional
    public void updateStatus(String ids, int status) {
        if (ids != null) {
            List<String> listIds = List.of(ids.split(","));
            if (!listIds.isEmpty()) {
                for (var id : listIds) {
                    var tableOrders = tableOrderRepository.findByTableId(Integer.parseInt(id));

                    if (status == CommonStatus.Table.EMPTY) {
                        if (tableOrders != null) {
                            for (var tableOrder : tableOrders) {
                                var order = orderRepository.findById(tableOrder.getOrder_Id());
                                if (order.get().getStatus() == CommonStatus.OrderStatus.DRAFT
                                        || order.get().getStatus() == CommonStatus.OrderStatus.WAITING_DELIVERY
                                        || order.get().getStatus() == CommonStatus.OrderStatus.IN_PROGRESS
                                        || order.get().getPaymentStatus() == CommonStatus.PaymentStatus.UNPAID) {
                                    throw new BaseException("Bàn có đơn hàng chưa thanh toán!");
                                } else {
                                    var table = tableRepository.findById(Integer.parseInt(id));
                                    table.ifPresent(value -> value.setStatus(status));
                                    tableRepository.save(table.get());
                                    tableOrder.setStatus(CommonStatus.Table.EMPTY);
                                    tableOrderRepository.save(tableOrder);
                                    order.get().setStatus(CommonStatus.OrderStatus.COMPLETED);
                                    orderRepository.save(order.get());
                                }
                            }

                        } else {
                            var table = tableRepository.findById(Integer.parseInt(id));
                            table.ifPresent(value -> value.setStatus(status));
                            tableRepository.save(table.get());
                        }

                    } else {
                        throw new BaseException("Bàn có đơn hàng chưa thanh toán!");
                    }
                }
            }
        }
    }
    @Override
    public PagingListResponse<OrderTableResponse> getOrdersAndTables(OrderFilterRequest filter) throws ParseException {
        filter.setStatuses("1,2,5");
        var orders = orderService.filter(filter);
        List<OrderTableResponse> orderTables = new ArrayList<>();
        for (var order : orders.getData()){
            var orderTable = mapperOrderTablesResponse(order);
            orderTables.add(orderTable);
        }
        return new PagingListResponse<>(
                orderTables,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), orders.getMetadata().getTotal()));
    }
    private OrderTableResponse mapperOrderTablesResponse(OrderResponse order) {
        OrderTableResponse tableOrderResponse = new OrderTableResponse();
        tableOrderResponse.setOrder(order);
        if (order != null) {
            var tableOrders = tableOrderRepository.findByTableId(order.getId());
            if(!tableOrders.isEmpty()){
                var tableIds = tableOrders.stream().map(TableOrder::getTable_id).collect(Collectors.toList());
                var orders = tableRepository.getTableByTableIds(tableIds);
                if(!orders.isEmpty()){
                    List<TableResponse> tables = new ArrayList<>();
                    for (var table : orders) {
                        var tableResponse = mapper.map(table, TableResponse.class);
                        tables.add(tableResponse);
                    }
                    tableOrderResponse.setTables(tables);
                }
            }
            return tableOrderResponse;
        }
        return null;
    }

    @Override
    public PagingListResponse<TableOrderResponse> getOrdersByTable(TableFilterRequest filter) {
        var tableResponses = filter(filter);
        List<TableOrderResponse> tableOrders = new ArrayList<>();
        for (var table : tableResponses.getData()) {
            var tableOrder = mapperTableOrdersResponse(table);
            tableOrders.add(tableOrder);
        }
        return new PagingListResponse<>(
                tableOrders,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), tableResponses.getMetadata().getTotal()));
    }

    private TableOrderResponse mapperTableOrdersResponse(TableResponse table) {
        TableOrderResponse tableOrderResponse = new TableOrderResponse();
        tableOrderResponse.setTable(table);
        if (table != null) {
            var tableOrders = tableOrderRepository.findByTableId(table.getId());
            if(!tableOrders.isEmpty()){
                var orderIds = tableOrders.stream().map(TableOrder::getOrder_Id).collect(Collectors.toList());
                var orders = orderRepository.getOrderByOrderIds(orderIds);
                if(!orders.isEmpty()){
                    List<OrderResponse> orderResponses = new ArrayList<>();
                    for (var order: orders) {
                        var orderResponse = orderService.mapperOrderResponse(order);
                        orderResponses.add(orderResponse);
                    }
                    tableOrderResponse.setOrders(orderResponses);
                }
            }
            return tableOrderResponse;
        }
        return null;
    }
}

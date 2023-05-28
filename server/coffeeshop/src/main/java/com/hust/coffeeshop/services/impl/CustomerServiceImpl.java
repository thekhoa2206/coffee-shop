package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.customer.CustomerFilterRequest;
import com.hust.coffeeshop.models.dto.customer.CustomerRequest;
import com.hust.coffeeshop.models.dto.customer.CustomerResponse;
import com.hust.coffeeshop.models.entity.Customer;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.CustomerRepository;
import com.hust.coffeeshop.models.repository.Filter;
import com.hust.coffeeshop.models.repository.FilterRepository;
import com.hust.coffeeshop.models.repository.QueryOperator;
import com.hust.coffeeshop.services.CustomerService;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;
    private final ModelMapper mapper;
    private final FilterRepository filterRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository, ModelMapper mapper, FilterRepository filterRepository) {
        this.customerRepository = customerRepository;
        this.mapper = mapper;
        this.filterRepository = filterRepository;
    }

    //api tạo
    @Override
    public CustomerResponse create(CustomerRequest request) {
        if (request.getName() == null) throw new ErrorException("Tên khách hàng không được để trống");
        if (request.getPhoneNumber() == null) throw new ErrorException("Số điện thoại khách hàng không được để trống");

        Customer customer = mapper.map(request, Customer.class);
        customer.setStatus(CommonStatus.CustomerStatus.ACTIVE);
        customer.setCreatedOn(CommonCode.getTimestamp());
        customer.setModifiedBy(1);
        customer.setCreatedBy(1);
        CustomerResponse customerResponse = null;
        try {
            var customerNew = customerRepository.save(customer);
            customerResponse = mapper.map(customerNew, CustomerResponse.class);
        } catch (Exception e) {
            throw new ErrorException("Tạo khách hàng thất bại");
        }
        return customerResponse;
    }

    //api update
    @Override
    public CustomerResponse update(CustomerRequest request, int id) {
        val customer = customerRepository.findById(id);
        if (customer.get() == null) throw new ErrorException("Không tìm thấy người dùng");
        if (request.getPhoneNumber() != null) customer.get().setPhoneNumber(request.getPhoneNumber());
        if (request.getName() != null) customer.get().setName(request.getName());
        if (request.getSex() != null) customer.get().setSex(request.getSex());
        if (request.getDob() != null) customer.get().setDob(request.getDob().getTime());
        customer.get().setModifiedOn(CommonCode.getTimestamp());
        CustomerResponse customerResponse = null;
        try {
            var customerNew = customerRepository.save(customer.get());
            customerResponse = mapper.map(customerNew, CustomerResponse.class);
        } catch (Exception e) {
            throw new ErrorException("Cập nhật khách hàng thất bại");
        }
        return customerResponse;
    }


    //api xóa
    @Override
    public void delete(int id) {
        val customer = customerRepository.findById(id);
        if (customer.get() == null) throw new ErrorException("Không tìm thấy người dùng");
        customer.get().setStatus(CommonStatus.CustomerStatus.DELETED);
        customer.get().setModifiedOn(CommonCode.getTimestamp());
        try {
            customerRepository.save(customer.get());
        } catch (Exception e) {
            throw new ErrorException("Xóa khách hàng thất bại");
        }
    }

    //api get id
    @Override
    public CustomerResponse getById(int id) {
        if (id == 0) throw new ErrorException("Không có id");
        var customer = customerRepository.findById(id);
        if (customer == null) throw new ErrorException("Không tìm thấy khách hàng");
        var customerResponse = mapper.map(customer.get(), CustomerResponse.class);
        return customerResponse;
    }


    //api filter
    @Override
    public PagingListResponse<CustomerResponse> filter(CustomerFilterRequest filter) {
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
                    .field("phoneNumber")
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
        Page<Customer> results;
        if (filters.size() > 0)
            results = customerRepository.findAll(filterRepository.getSpecificationFromFilters(filters), pageable);
        else results = customerRepository.findAll(pageable);
        List<CustomerResponse> customerResponses = new ArrayList<>();
        for (val customer : results.getContent()
        ) {
            val customerResponse = mapper.map(customer, CustomerResponse.class);
            customerResponses.add(customerResponse);
        }

        return new PagingListResponse<>(
                customerResponses,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), results.getTotalElements()));
    }

}

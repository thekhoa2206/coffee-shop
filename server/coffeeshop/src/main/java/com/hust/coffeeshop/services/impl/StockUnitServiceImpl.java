package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitFilterRequest;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitRequest;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitResponse;
import com.hust.coffeeshop.models.entity.StockUnit;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.Filter;
import com.hust.coffeeshop.models.repository.FilterRepository;
import com.hust.coffeeshop.models.repository.QueryOperator;
import com.hust.coffeeshop.models.repository.StockUnitRepository;
import com.hust.coffeeshop.services.StockUnitService;
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
public class StockUnitServiceImpl implements StockUnitService {
    private final StockUnitRepository stockUnitRepository;
    private final ModelMapper modelMapper;
    private final FilterRepository filterRepository;

    public StockUnitServiceImpl(StockUnitRepository stockUnitRepository, ModelMapper modelMapper, FilterRepository filterRepository) {
        this.stockUnitRepository = stockUnitRepository;
        this.modelMapper = modelMapper;
        this.filterRepository = filterRepository;
    }


    //Hàm tạo mới đơn vị
    @Override
    public StockUnitResponse create(StockUnitRequest request) {
        if (request.getName() == null) throw new ErrorException("Tên đơn vị không được để trống");
        StockUnit stockUnit = new StockUnit();
        stockUnit.setStatus(CommonStatus.StockUnitStatus.ACTIVE);
        stockUnit.setName(request.getName());
        stockUnit.setCreatedOn();
        stockUnit.setModifiedOn();
        stockUnit = stockUnitRepository.save(stockUnit);
        var stockUnitResponse = modelMapper.map(stockUnit, StockUnitResponse.class);
        stockUnitResponse.set();
        return stockUnitResponse;
    }

    //Hàm cập nhật đơn vị
    @Override
    public StockUnitResponse update(StockUnitRequest request, int id) {
        if (id == 0) throw new ErrorException("Không tìm thấy thông tin đơn vị");
        StockUnit stockUnit = stockUnitRepository.findById(id).get();
        stockUnit.setName(request.getName());
        stockUnit.setModifiedOn();

        stockUnit = stockUnitRepository.save(stockUnit);
        var stockUnitResponse = modelMapper.map(stockUnit, StockUnitResponse.class);
        stockUnitResponse.set();
        return stockUnitResponse;
    }

    //Hàm xoá đơn vị
    @Override
    public void delete(int id) {
        if (id == 0) throw new ErrorException("Không tìm thấy thông tin đơn vị");
        StockUnit stockUnit = stockUnitRepository.findById(id).get();
        stockUnit.setModifiedOn();
        stockUnit.setStatus(CommonStatus.StockUnitStatus.DELETED);
        stockUnitRepository.save(stockUnit);
    }

    //Hàm lấy thông tin đơn vị theo id
    @Override
    public StockUnitResponse getById(int id) {
        if (id == 0) throw new ErrorException("Không tìm thấy thông tin đơn vị");
        StockUnit stockUnit = stockUnitRepository.findById(id).get();
        var stockUnitResponse = modelMapper.map(stockUnit, StockUnitResponse.class);
        stockUnitResponse.set();
        return stockUnitResponse;
    }

    //Hàm lọc danh sách đơn vị
    @Override
    public PagingListResponse<StockUnitResponse> filter(StockUnitFilterRequest filter) {
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
        Page<StockUnit> results;
        if (filters.size() > 0)
            results = stockUnitRepository.findAll(filterRepository.getSpecificationFromFilters(filters), pageable);
        else results = stockUnitRepository.findAll(pageable);
        List<StockUnitResponse> stockUnitResponses = new ArrayList<>();
        for (val customer : results.getContent()
        ) {
            val stockUnitResponse = modelMapper.map(customer, StockUnitResponse.class);
            stockUnitResponses.add(stockUnitResponse);
        }

        return new PagingListResponse<>(
                stockUnitResponses,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), results.getTotalElements()));
    }
}

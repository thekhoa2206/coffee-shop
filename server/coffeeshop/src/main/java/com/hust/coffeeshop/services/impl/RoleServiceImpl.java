package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.item.request.ItemRequest;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;
import com.hust.coffeeshop.models.dto.role.CreateRoleRequest;
import com.hust.coffeeshop.models.dto.role.RoleResponse;
import com.hust.coffeeshop.models.dto.variant.response.VariantRepsone;
import com.hust.coffeeshop.models.entity.Item;
import com.hust.coffeeshop.models.entity.Role;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.Filter;
import com.hust.coffeeshop.models.repository.FilterRepository;
import com.hust.coffeeshop.models.repository.QueryOperator;
import com.hust.coffeeshop.models.repository.RoleRepository;
import com.hust.coffeeshop.services.RoleService;
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
public class  RoleServiceImpl implements RoleService {
        private final RoleRepository roleRepository;
    private final ModelMapper mapper;
    private final FilterRepository filterRepository;

    public RoleServiceImpl(RoleRepository roleRepository, ModelMapper mapper, FilterRepository filterRepository) {
        this.roleRepository = roleRepository;
        this.mapper = mapper;
        this.filterRepository = filterRepository;
    }

    //Hàm tạo mới quyền
    @Override
    public RoleResponse create(CreateRoleRequest request) {
        if(request.getName()== null ) throw new ErrorException("Tên quyền không được để trống ");
        Role role = new Role();
        role.setName(request.getName());
        role.setCode(CommonCode.GenerateCodeRole());
        role.setCreatedOn(CommonCode.getTimestamp());
        role.setScopes(request.getScopes());
        RoleResponse roleResponse = null;
        try {
            var roleNew = roleRepository.save(role);
            roleResponse = mapper.map(roleNew, RoleResponse.class);
        } catch (Exception e) {
            throw new ErrorException("Tạo khách hàng thất bại");
        }
        return roleResponse;
    }
    //Hàm lấy thông tin quyền theo id
    @Override
    public Role getById(int id) {
        if (id == 0) throw new ErrorException("Không có id");
        var role = roleRepository.findById(id);
        if (role == null) throw new ErrorException("Không tìm thấy quyền");
        var roleResponse = mapper.map(role.get(), Role.class);
        return roleResponse;
    }
    //hàm lọc danh sách quyền
    @Override
    public PagingListResponse<RoleResponse> filter(ItemRequest filter) {
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
            Filter statuses = Filter.builder()
                    .field("status")
                    .operator(QueryOperator.IN)
                    .values(Arrays.asList(filter.getStatuses().split(",")))
                    .build();
            filters.add(statuses);
        }
        Page<Role> results;
        if (filters.size() > 0)
            results = roleRepository.findAll(filterRepository.getSpecificationFromFilters(filters), pageable);
        else results = roleRepository.findAll(pageable);
        List<RoleResponse> roleRepsones = new ArrayList<>();
        for (val role : results.getContent()
        ) {
            val roleResponse = mapper.map(role, RoleResponse.class);
            roleRepsones.add(roleResponse);
        }

        return new PagingListResponse<>(
                roleRepsones,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), results.getTotalElements()));
    }
}

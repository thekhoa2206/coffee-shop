package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.models.dto.customer.CustomerResponse;
import com.hust.coffeeshop.models.dto.role.CreateRoleRequest;
import com.hust.coffeeshop.models.dto.role.RoleResponse;
import com.hust.coffeeshop.models.dto.user.response.UserResponse;
import com.hust.coffeeshop.models.entity.Role;
import com.hust.coffeeshop.models.entity.User;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.RoleRepository;
import com.hust.coffeeshop.services.RoleService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceImpl implements RoleService {
        private final RoleRepository roleRepository;
    private final ModelMapper mapper;

    public RoleServiceImpl(RoleRepository roleRepository, ModelMapper mapper) {
        this.roleRepository = roleRepository;
        this.mapper = mapper;
    }

    //api tạo
    @Override
    public RoleResponse create(CreateRoleRequest request) {
        if(request.getName()== null ) throw new ErrorException("Tên quyền không được để trống ");
        Role role = new Role();
        role.setName(request.getName());
        role.setCode(CommonCode.GenerateCodeRole());
        role.setCreatedOn(CommonCode.getTimestamp());
        RoleResponse roleResponse = null;
        try {
            var roleNew = roleRepository.save(role);
            roleResponse = mapper.map(roleNew, RoleResponse.class);
        } catch (Exception e) {
            throw new ErrorException("Tạo khách hàng thất bại");
        }
        return roleResponse;
    }
    //api get id
    @Override
    public Role getById(int id) {
        if (id == 0) throw new ErrorException("Không có id");
        var role = roleRepository.findById(id);
        if (role == null) throw new ErrorException("Không tìm thấy quyền");
        var roleResponse = mapper.map(role.get(), Role.class);
        return roleResponse;
    }
}

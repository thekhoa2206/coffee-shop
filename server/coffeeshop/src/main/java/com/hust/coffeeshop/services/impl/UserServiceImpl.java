package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.models.dto.user.request.CreateUserRequest;
import com.hust.coffeeshop.models.dto.user.response.UserResponse;
import com.hust.coffeeshop.models.entity.Role;
import com.hust.coffeeshop.models.entity.User;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.RoleRepository;
import com.hust.coffeeshop.models.repository.UserRepository;
import com.hust.coffeeshop.services.RoleService;
import com.hust.coffeeshop.services.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final ModelMapper mapper;
    private final UserRepository userRepository;
    private  final RoleRepository roleRepository;
    private  final RoleService roleService;

    public UserServiceImpl(ModelMapper mapper, UserRepository userRepository, RoleRepository roleRepository, RoleService roleService) {
        this.mapper = mapper;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.roleService = roleService;
    }


    //api tạo
    @Override
    public UserResponse create(CreateUserRequest request) {
        if (request.getName() == null) throw new ErrorException("Tên  nhân viên không được để trống");
        if (request.getPhoneNumber() == null) throw new ErrorException("Số điện thoại nhân viên không được để trống");
        if(request.getPassword()== null) throw new ErrorException("Mật khẩu không được để trống");
        if(request.getUsername()== null) throw new ErrorException("Tên đăng nhập không được để trống");
        List<Role> role = new ArrayList<>();
        var role1 = roleService.getById(request.getRoleId());
        role.add(role1);
        User user = mapper.map(request, User.class);
        user.setPassword(CommonCode.GeneratePassword(request.getPassword()));
        user.setRoles(role);
        user.setStatus(CommonStatus.CustomerStatus.ACTIVE);
        user.setCreatedOn();

        UserResponse userResponse = null;
        try {
            var userNew = userRepository.save(user);
            userResponse = mapper.map(userNew, UserResponse.class);
            userResponse.setRole(role1.getName());
        } catch (Exception e) {
            throw new ErrorException("Tạo khách hàng thất bại");
        }
        return userResponse;
    }
}

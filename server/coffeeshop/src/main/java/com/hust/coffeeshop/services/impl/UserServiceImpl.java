package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.models.dto.customer.CustomerResponse;
import com.hust.coffeeshop.models.dto.user.request.CreateUserRequest;
import com.hust.coffeeshop.models.dto.user.response.UserResponse;
import com.hust.coffeeshop.models.entity.Customer;
import com.hust.coffeeshop.models.entity.User;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.UserRepository;
import com.hust.coffeeshop.services.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class UserServiceImpl implements UserService {
    private final ModelMapper mapper;
    private final UserRepository userRepository;

    public UserServiceImpl(ModelMapper mapper, UserRepository userRepository) {
        this.mapper = mapper;
        this.userRepository = userRepository;
    }


    //api tạo
    @Override
    public UserResponse create(CreateUserRequest request) {
        if (request.getName() == null) throw new ErrorException("Tên  nhân viên không được để trống");
        if (request.getPhoneNumber() == null) throw new ErrorException("Số điện thoại nhân viên không được để trống");
        if(request.getPassword()== null) throw new ErrorException("Mật khẩu không được để trống");
        if(request.getUsername()== null) throw new ErrorException("Tên đăng nhập không được để trống");
        User user = mapper.map(request, User.class);
        user.setStatus(CommonStatus.CustomerStatus.ACTIVE);
        user.setCreatedOn(new Date());
        user.setCreatedBy(1);
        user.setModifiedOn(new Date());
        UserResponse userResponse = null;
        try {
            var userNew = userRepository.save(user);
            userResponse = mapper.map(userNew, UserResponse.class);
        } catch (Exception e) {
            throw new ErrorException("Tạo khách hàng thất bại");
        }
        return userResponse;
    }
}

package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.ingredient.IngredientFilterRequest;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;
import com.hust.coffeeshop.models.dto.user.request.CreateUserRequest;
import com.hust.coffeeshop.models.dto.user.response.UserResponse;
import com.hust.coffeeshop.models.dto.variant.response.VariantRepsone;
import com.hust.coffeeshop.models.entity.Ingredient;
import com.hust.coffeeshop.models.entity.Role;
import com.hust.coffeeshop.models.entity.User;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.RoleService;
import com.hust.coffeeshop.services.UserService;
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
public class UserServiceImpl implements UserService {
    private final ModelMapper mapper;
    private final UserRepository userRepository;
    private  final RoleRepository roleRepository;
    private  final RoleService roleService;
    private  final FilterRepository filterRepository;

    public UserServiceImpl(ModelMapper mapper, UserRepository userRepository, RoleRepository roleRepository, RoleService roleService, FilterRepository filterRepository) {
        this.mapper = mapper;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.roleService = roleService;
        this.filterRepository = filterRepository;
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
        user.setStatus(CommonStatus.UserStatus.ACTIVE);
        user.setCreatedOn(CommonCode.getTimestamp());
        user.setModifiedOn(0);

        UserResponse userResponse = null;
        try {
            var userNew = userRepository.save(user);
            userResponse = mapper.map(userNew, UserResponse.class);
            userResponse.setRole(role1.getName());
        } catch (Exception e) {
            throw new ErrorException("Tạo nhân viên thất bại");
        }
        return userResponse;
    }
    //api tạo
    @Override
    public UserResponse update(CreateUserRequest request,int id) {
        val users = userRepository.findById(id);
        if (users.get() == null) throw new ErrorException("không tìm thấy nhân viên");
        if (request.getPhoneNumber() != null)  users.get().setPhoneNumber(request.getPhoneNumber());
        if(request.getPassword()!= null) users.get().setPassword(request.getPassword());
        if(request.getUsername()!= null) users.get().setUsername(request.getUsername());
        users.get().setName(request.getName());
        users.get().setModifiedOn(CommonCode.getTimestamp());
        List<Role> role = new ArrayList<>();
        String roleName = null;
        if(request.getRoleId() != 0)
        {
            var role1 = roleService.getById(request.getRoleId());
            roleName= role1.getName();
            role.add(role1);
            users.get().setRoles(role);
        }
        users.get().setModifiedOn(CommonCode.getTimestamp());
        UserResponse userResponse = null;
        try {
            var userNew = userRepository.save(users.get());
            userResponse = mapper.map(userNew, UserResponse.class);
            userResponse.setRole(roleName);
        } catch (Exception e) {
            throw new ErrorException("cập nhật nhân viên thất bại");
        }
        return userResponse;
    }
    @Override
    public UserResponse getById(int id) {
        val users = userRepository.findById(id);
        if (users.get() == null) throw new ErrorException("không tìm thấy nhân viên");
         val userResponse = mapper.map(users.get(), UserResponse.class);
        for(val r:users.get().getRoles()){
            userResponse.setRole(r.getName());
        }
         return userResponse;
    }
    @Override
        public void deleteById(int id) {
        val users = userRepository.findById(id);
        if (users.get() == null) throw new ErrorException("không tìm thấy nhân viên");
        users.get().setStatus(CommonStatus.UserStatus.DELETED);
        users.get().setModifiedOn(CommonCode.getTimestamp());
        try {
            userRepository.save(users.get());
        } catch (Exception e) {
            throw new ErrorException("Xoá nhân viên thất bại");
        }
    }
    @Override
    public PagingListResponse<UserResponse> filterUser(IngredientFilterRequest filter){
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
        Page<User> results;
        if (filters.size() > 0)
            results = userRepository.findAll(filterRepository.getSpecificationFromFilters(filters), pageable);
        else results = userRepository.findAll(pageable);
        List<UserResponse> userRepsones = new ArrayList<>();
        for (val user : results.getContent()
        ) {
            val userResponse = mapper.map(user, UserResponse.class);
            for(val r:user.getRoles()){
                userResponse.setRole(r.getName());
            }

            if(user.getStatus() ==1){
                userRepsones.add(userResponse);
            }
        }return new PagingListResponse<>(
                userRepsones,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), results.getTotalElements()));
    }
}

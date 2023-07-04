package com.hust.coffeeshop.job;

import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.configuration.jwt.JwtProvider;
import com.hust.coffeeshop.models.entity.Role;
import com.hust.coffeeshop.models.entity.User;
import com.hust.coffeeshop.models.repository.RoleRepository;
import com.hust.coffeeshop.models.repository.UserRepository;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Arrays;

@Component
public class CreateUser {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtProvider jwtProvider;

    public CreateUser(UserRepository userRepository, RoleRepository roleRepository, JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtProvider = jwtProvider;
    }

    @PostConstruct
    private void initUserAdmin(){
        var roleOlds = roleRepository.findByCode("ADMIN");
        Role role = new Role();
        if(roleOlds == null && roleOlds.size() == 0){
            role.setScopes("full");
            role.setCreatedOn();
            role.setModifiedBy("admin");
            role.setCreatedBy("admin");
            role.setModifiedOn();
            role.setName("Quản lý");
            role.setCode("AMDIN");
            role.setStatus("active");
            role = roleRepository.save(role);

            User user = new User();
            user.setPassword(jwtProvider.generatePassword("admin"));
            user.setCreatedOn();
            user.setModifiedBy("admin");
            user.setCreatedBy("admin");
            user.setModifiedOn();
            user.setStatus(CommonStatus.UserStatus.ACTIVE);
            user.setRoles(new ArrayList<>(Arrays.asList(role)));
            user.setUsername("admin");
            user.setEmail("admin");
            user.setName("Quản lý");
            userRepository.save(user);
        }
    }
}

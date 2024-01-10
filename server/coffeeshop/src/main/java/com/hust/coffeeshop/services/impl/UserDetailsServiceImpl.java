package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.models.dto.security.UserPrinciple;
import com.hust.coffeeshop.models.dto.security.UserSecurity;
import com.hust.coffeeshop.models.entity.User;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.UserRepository;
import lombok.SneakyThrows;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    ModelMapper mapperFeature;


    //Hàm lấy thông tin user theo username
    @SneakyThrows
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = null;
        try {
            user = userRepository.findUserByUsername(username);
        } catch (Exception e) {
            throw new ErrorException("Không tìm thấy username");
        }
        val accountSecurity = mapperFeature.map(user, UserSecurity.class);
        return UserPrinciple.build(accountSecurity);
    }
}
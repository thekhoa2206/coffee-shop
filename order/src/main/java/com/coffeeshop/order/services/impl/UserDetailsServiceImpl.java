package com.coffeeshop.order.services.impl;

import com.coffeeshop.order.models.dto.security.UserPrinciple;
import com.coffeeshop.order.models.dto.security.UserSecurity;
import com.coffeeshop.order.models.entity.User;
import com.coffeeshop.order.models.exception.ErrorException;
import com.coffeeshop.order.models.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.SneakyThrows;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    ModelMapper mapperFeature;


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
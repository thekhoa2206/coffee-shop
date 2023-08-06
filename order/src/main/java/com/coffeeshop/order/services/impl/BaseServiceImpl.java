package com.coffeeshop.order.services.impl;

import com.coffeeshop.order.configuration.jwt.JwtProvider;
import com.coffeeshop.order.models.entity.User;
import com.coffeeshop.order.models.repository.UserRepository;
import com.coffeeshop.order.services.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public class BaseServiceImpl implements BaseService {
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    public BaseServiceImpl(JwtProvider jwtProvider, UserRepository userRepository) {
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
    }
    public User getuser(HttpServletRequest request){
        String tokenBearer = request.getHeader("Authorization");
        String[] splits = tokenBearer.split("");
        String username = jwtProvider.getUserNameFromJwtToken(splits[1]);
        User user = userRepository.findUserByUsername(username);

        return user;
    }
}

package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.configuration.jwt.JwtProvider;
import com.hust.coffeeshop.models.entity.User;
import com.hust.coffeeshop.models.repository.UserRepository;
import com.hust.coffeeshop.services.BaseService;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;

@Service
public class BaseServiceImpl implements BaseService {
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    public BaseServiceImpl(JwtProvider jwtProvider, UserRepository userRepository) {
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
    }
    //HÀm lấy thông tin user bằng token
    public User getuser(HttpServletRequest request){
        String tokenBearer = request.getHeader("Authorization");
        String[] splits = tokenBearer.split("");
        String username = jwtProvider.getUserNameFromJwtToken(splits[1]);
        User user = userRepository.findUserByUsername(username);

        return user;
    }
}

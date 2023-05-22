package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.configuration.jwt.JwtProvider;
import com.hust.coffeeshop.models.dto.security.JwtResponse;
import com.hust.coffeeshop.models.dto.user.UserResponse;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.UserRepository;
import lombok.val;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api")
@CrossOrigin("http://localhost:3000")
public class AuthController extends BaseController {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;

    public AuthController(UserRepository userRepository, AuthenticationManager authenticationManager, JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
    }

    //Api Login
    @GetMapping(value = "/login")
    public JwtResponse login(@RequestParam String username, @RequestParam String password) {
        if (username == null || username.isEmpty()) {
            throw new ErrorException("Username không được để trống!");
        }
        if (password == null || password.isEmpty()) {
            throw new ErrorException("Mật khẩu không được để trống!");
        }
        val user = userRepository.findUserByUsername(username);
        if (user == null) {
            throw new ErrorException("Không tìm thấy account!");
        }
        if (user != null) {
            val pass = user.getPassword();
            if (!BCrypt.checkpw(password, pass))
                throw new ErrorException("Mật khẩu sai!");

        }
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtProvider.generateJwtToken(authentication);
        val jwtData = new JwtResponse();
        jwtData.setToken(jwt);
        return jwtData;
    }

    @GetMapping(value = "/profiles")
    public UserResponse getProfile(@RequestParam String username, @RequestParam String password) {
        return null;
    }

}

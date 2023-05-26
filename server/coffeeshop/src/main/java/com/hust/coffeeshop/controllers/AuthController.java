package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.configuration.jwt.JwtProvider;
import com.hust.coffeeshop.models.dto.security.JwtResponse;
import com.hust.coffeeshop.models.dto.user.UserResponse;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.UserRepository;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/api")
@CrossOrigin("http://localhost:3000")
public class AuthController extends BaseController {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final ModelMapper mapper;

    public AuthController(UserRepository userRepository, AuthenticationManager authenticationManager, JwtProvider jwtProvider, ModelMapper mapper) {
        super(userRepository, jwtProvider);
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
        this.mapper = mapper;
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
    public UserResponse getProfile(HttpServletRequest request) {
        var jwt = request.getHeader("Authorization");
        var user = getUserByJwt(jwt);
        var userResponse = mapper.map(user, UserResponse.class);
        List<UserResponse.RoleResponse> roleResponses = new ArrayList<>();
        for (var role : user.getRoles()) {
            UserResponse.RoleResponse roleResponse = new UserResponse.RoleResponse();
            role.setCode(role.getCode());
            role.setName(role.getName());
            role.setStatus(role.getStatus());
            role.setCreatedBy(role.getCreatedBy());
            role.setCreatedOn(role.getCreatedOn());
            role.setModifiedBy(role.getModifiedBy());
            role.setModifiedOn(role.getModifiedOn());
            role.setId(role.getId());
            roleResponses.add(roleResponse);
        }
        userResponse.setRoleResponses(roleResponses);
        return userResponse;
    }

}

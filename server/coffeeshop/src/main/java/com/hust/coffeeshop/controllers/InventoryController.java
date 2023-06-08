package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.configuration.jwt.JwtProvider;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.inventory.repsone.InventoryReponse;
import com.hust.coffeeshop.models.dto.inventory.request.CreateinventoryRequest;
import com.hust.coffeeshop.models.dto.item.request.ItemRequest;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;
import com.hust.coffeeshop.models.entity.User;
import com.hust.coffeeshop.models.exception.BaseException;
import com.hust.coffeeshop.models.repository.UserRepository;
import com.hust.coffeeshop.services.InventoryService;
import com.hust.coffeeshop.services.UserService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value = "/api/inventory")
@CrossOrigin("http://localhost:3000")
public class InventoryController extends BaseException {
    private final InventoryService inventoryService;
    private final UserService userService;
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;


    public InventoryController(InventoryService inventoryService, UserService userService, JwtProvider jwtProvider, UserRepository userRepository) {
        this.inventoryService = inventoryService;
        this.userService = userService;
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
    }
    public User getuser(HttpServletRequest request){
        String tokenBearer = request.getHeader("Authorization");
        String[] splits = tokenBearer.split(" ");
        String username = jwtProvider.getUserNameFromJwtToken(splits[1]);
        User user = userRepository.findUserByUsername(username);

        return user;
    }
    // tạo user mới
    @PostMapping
    public InventoryReponse create(@RequestBody CreateinventoryRequest request,HttpServletRequest requestHttp)
    { return inventoryService.create(request,requestHttp);
    }
    @GetMapping("/{id}")
    public InventoryReponse getById(@PathVariable("id") int id){
        return inventoryService.getbyId(id);
    }

    @GetMapping
    public PagingListResponse<InventoryReponse> filter(ItemRequest filter){
        return inventoryService.filter(filter);
    }
}

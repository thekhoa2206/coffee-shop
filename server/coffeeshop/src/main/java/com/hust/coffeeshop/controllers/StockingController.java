package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.configuration.jwt.JwtProvider;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.item.request.CreateItemRequest;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;
import com.hust.coffeeshop.models.dto.stocktaking.repsone.StocktakingReponse;
import com.hust.coffeeshop.models.dto.stocktaking.request.CreateStocktakingRequest;
import com.hust.coffeeshop.models.dto.stocktaking.request.StoctakingFilterRequest;
import com.hust.coffeeshop.models.entity.User;
import com.hust.coffeeshop.models.exception.BaseException;
import com.hust.coffeeshop.models.repository.UserRepository;
import com.hust.coffeeshop.services.StocktakingService;
import com.hust.coffeeshop.services.UserService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value = "/api/stocktaking")
@CrossOrigin("http://localhost:3000")
public class StockingController extends BaseException {
    private final StocktakingService stocktakingService;
    private final UserService userService;
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;


    public StockingController(StocktakingService stocktakingService, UserService userService, JwtProvider jwtProvider, UserRepository userRepository) {
        this.stocktakingService = stocktakingService;
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
    public StocktakingReponse create(@RequestBody CreateStocktakingRequest request, HttpServletRequest requestHttp)
    { return stocktakingService.create(request,requestHttp);
    }
    @GetMapping("/{id}")
    public StocktakingReponse getById(@PathVariable("id") int id){
        return stocktakingService.getbyId(id);
    }

    @GetMapping
    public PagingListResponse<StocktakingReponse> filter(StoctakingFilterRequest filter){
        return stocktakingService.filter(filter);
    }
    @PutMapping("/{id}")
    public StocktakingReponse update(@RequestBody CreateStocktakingRequest request, @PathVariable("id") int id){
        return stocktakingService.update(request, id);
    }

    @DeleteMapping
    public void delete(@PathVariable("id") int id){
        stocktakingService.delete(id);
    }
}

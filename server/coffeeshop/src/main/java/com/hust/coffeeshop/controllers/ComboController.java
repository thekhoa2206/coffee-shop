package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.combo.request.CreateComboRequest;
import com.hust.coffeeshop.models.dto.combo.response.ComboRespone;
import com.hust.coffeeshop.services.ComboService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/combo")
@CrossOrigin("http://localhost:3000")
public class ComboController {
    private final ComboService comboService;

    public ComboController(ComboService comboService) {
        this.comboService = comboService;
    }


    @PostMapping
    public ComboRespone create(@RequestBody CreateComboRequest request){
        return comboService.create(request);
    }
    @PutMapping("/{id}")
    public ComboRespone update(@RequestBody CreateComboRequest request, @PathVariable("id") int id){
        return comboService.update(request,id);
    }

}

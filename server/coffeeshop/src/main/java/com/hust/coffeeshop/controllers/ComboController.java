package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.combo.request.CreateComboRequest;
import com.hust.coffeeshop.models.dto.combo.response.ComboRespone;
import com.hust.coffeeshop.models.dto.item.request.ItemRequest;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;
import com.hust.coffeeshop.services.ComboService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping(value = "/api/combo")
@CrossOrigin("http://localhost:3000")
public class ComboController {
    private final ComboService comboService;

    public ComboController(ComboService comboService) {
        this.comboService = comboService;
    }

    @GetMapping("/{id}")
    public ComboRespone getById(@PathVariable("id") int id)
    {
        return comboService.getbyId(id);
    }

    @GetMapping
    public PagingListResponse<ComboRespone> filter(ItemRequest filter){
        return comboService.filter(filter);
    }
    @PostMapping
    public ComboRespone create(@RequestBody CreateComboRequest request) throws IOException {
        return comboService.create(request);
    }
    @PutMapping("/{id}")
    public ComboRespone update(@RequestBody CreateComboRequest request, @PathVariable("id") int id){
        return comboService.update(request,id);
    }
    @DeleteMapping
    public void delete(@PathVariable("id") int id){
        comboService.delete(id);
    }

}

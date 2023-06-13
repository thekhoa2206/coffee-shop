package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.variant.VariantFilterRequest;
import com.hust.coffeeshop.models.dto.variant.response.VariantRepsone;
import com.hust.coffeeshop.services.VariantService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/variants")
public class VariantController {
    private final VariantService variantService;

    public VariantController(VariantService variantService) {
        this.variantService = variantService;
    }

    @GetMapping
    public PagingListResponse<VariantRepsone> filter(VariantFilterRequest filter){
        return variantService.filter(filter);
    }
}

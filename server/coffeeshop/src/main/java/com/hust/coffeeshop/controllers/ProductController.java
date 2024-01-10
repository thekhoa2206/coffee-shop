package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.product.ProductFilterRequest;
import com.hust.coffeeshop.models.dto.product.ProductResponse;
import com.hust.coffeeshop.services.ProductService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/products")
@CrossOrigin("http://localhost:3000")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    //Api lọc danh sách sản phẩm (combo + phiên bản) bán hàng để tạo đơn hàng
    @GetMapping
    public PagingListResponse<ProductResponse> filter(ProductFilterRequest filter){
        return productService.filter(filter);
    }
}

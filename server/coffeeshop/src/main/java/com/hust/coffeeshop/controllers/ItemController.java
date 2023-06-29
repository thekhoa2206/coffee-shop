package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.dto.FileResponse;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.item.request.CreateItemRequest;
import com.hust.coffeeshop.models.dto.item.request.ItemRequest;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;
import com.hust.coffeeshop.models.exception.BaseException;
import com.hust.coffeeshop.services.FileStorageService;
import com.hust.coffeeshop.services.ItemService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;

@RestController
@RequestMapping(value = "/api/item")
@CrossOrigin("http://localhost:3000")
public class ItemController extends BaseException {
    private final ItemService itemService;
    private final FileStorageService fileStorageService;

    public ItemController(ItemService itemService, FileStorageService fileStorageService) {
        this.itemService = itemService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/{id}")
    public ItemRepsone getById(@PathVariable("id") int id){
        return itemService.getById(id);
    }

    @GetMapping
    public PagingListResponse<ItemRepsone> filter(ItemRequest filter){
        return itemService.filter(filter);
    }
    // tạo user mới
    @PostMapping
    public ItemRepsone create(@RequestBody CreateItemRequest request)
    {
        return itemService.create(request);
    }
    @PutMapping("/{id}")
    public ItemRepsone update(@RequestBody CreateItemRequest request, @PathVariable("id") int id){
        return itemService.update(request, id);
    }

    @DeleteMapping
    public void delete(@PathVariable("id") int id){
        itemService.delete(id);
    }
    @PostMapping(value = "/image")
    public FileResponse uploadFile(@RequestParam("file") MultipartFile file )throws IOException {
       return fileStorageService.uploadFile(file);
    }
    @GetMapping(value = "/image/view/{id}")
    public ResponseEntity<byte[]>  viewFile(@PathVariable int id)  throws IOException{
        return fileStorageService.getImage(id);
    }

}

package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.combo.request.CreateComboRequest;
import com.hust.coffeeshop.models.dto.combo.response.ComboRespone;
import com.hust.coffeeshop.models.dto.item.request.ItemRequest;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ComboService {
    ComboRespone create(CreateComboRequest request, MultipartFile image) throws IOException;
    ComboRespone update(CreateComboRequest request,int id);
    ComboRespone getbyId(int id);
    void delete(int id);
    PagingListResponse<ComboRespone> filter(ItemRequest filter);
}

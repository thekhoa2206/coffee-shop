package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.combo.request.CreateComboRequest;
import com.hust.coffeeshop.models.dto.combo.response.ComboRespone;

public interface ComboService {
    ComboRespone create(CreateComboRequest request);
}

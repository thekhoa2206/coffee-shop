package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.shift.ShiftRequest;
import com.hust.coffeeshop.models.dto.shift.ShiftRespone;

public interface ShiftService {
    ShiftRespone create(int user_id) ;
    ShiftRespone getByUserId(int id);
}

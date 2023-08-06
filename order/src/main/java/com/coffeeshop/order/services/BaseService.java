package com.coffeeshop.order.services;

import com.coffeeshop.order.models.entity.User;
import jakarta.servlet.http.HttpServletRequest;

public interface BaseService {
    User getuser(HttpServletRequest request);
}

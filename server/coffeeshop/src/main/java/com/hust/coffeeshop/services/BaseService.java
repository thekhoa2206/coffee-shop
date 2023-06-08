package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.entity.User;

import javax.servlet.http.HttpServletRequest;

public interface BaseService {
    User getuser(HttpServletRequest request);
}

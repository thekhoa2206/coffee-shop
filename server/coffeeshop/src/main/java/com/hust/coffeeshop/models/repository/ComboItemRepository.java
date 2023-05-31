package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.ComboItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ComboItemRepository   extends JpaRepository<ComboItem, Integer>, JpaSpecificationExecutor<ComboItem> {
}

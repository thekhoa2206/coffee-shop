package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.ComboItem;
import com.hust.coffeeshop.models.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ComboItemRepository   extends JpaRepository<ComboItem, Integer>, JpaSpecificationExecutor<ComboItem> {
    @Query(value = "SELECT combo_item.* FROM combo_item WHERE combo_id = ?1 ", nativeQuery = true)
    List<ComboItem> findUserByComboId(int comboId);
}

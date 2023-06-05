package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.ComboItem;
import com.hust.coffeeshop.models.entity.User;
import com.hust.coffeeshop.models.entity.Variant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ComboItemRepository   extends JpaRepository<ComboItem, Integer>, JpaSpecificationExecutor<ComboItem> {
    @Query(value = "SELECT combo_item.* FROM combo_item WHERE combo_id = ?1 ", nativeQuery = true)
    List<ComboItem> findUserByComboId(int comboId);
    @Query(value = "SELECT combo_item.* FROM combo_item WHERE combo_id = ?1 AND  variant_id = ?2", nativeQuery = true)
    ComboItem findUserByComboIdVAndVariantId(int comboId,int variantId);
//    @Query(value = "SELECT variant.* FROM variant WHERE item_id = ?1 AND  status = 1", nativeQuery = true)
//    List<Variant> findVariantByItemId(int itemId);
}

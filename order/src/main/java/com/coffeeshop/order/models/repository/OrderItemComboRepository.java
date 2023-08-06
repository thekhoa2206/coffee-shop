package com.coffeeshop.order.models.repository;

import com.coffeeshop.order.models.entity.OrderItemCombo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemComboRepository extends JpaRepository<OrderItemCombo, Integer>, JpaSpecificationExecutor<OrderItemCombo> {
    @Query(value = "SELECT order_item_combo.* FROM order_item_combo WHERE order_item_id in (?1) AND status = 1", nativeQuery = true)
    List<OrderItemCombo> findOrderItemComboByOrderItemIds(List<Integer> orderItemIds);

    @Query(value = "SELECT order_item_combo.* FROM order_item_combo WHERE order_item_id= ?1 AND status = 1", nativeQuery = true)
    List<OrderItemCombo> findOrderItemComboByOrderItemId(int orderItemId);
    @Query(value = "SELECT  order_item_combo.* FROM order_item_combo WHERE  variant_id=?1 AND  created_on>=?2 AND created_on<=?3  ", nativeQuery = true)
    List<OrderItemCombo>  findItemIngredientByIngredientId(int variantId, long startDate, long endDate);
}

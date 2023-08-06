package com.coffeeshop.order.models.repository;

import com.coffeeshop.order.models.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer>, JpaSpecificationExecutor<OrderItem> {
    @Query(value = "SELECT order_item.* FROM order_item WHERE order_id= ?1 AND status = 1", nativeQuery = true)
    List<OrderItem> findOrderItemByOrderId(int  orderId);
    @Query(value = "SELECT  order_item.* FROM order_item WHERE  product_id=?1 AND  created_on>=?2 AND created_on<=?3 AND combo=0 ", nativeQuery = true)
    List<OrderItem>  findOrderItemByIngredientId(int variantId, long startDate, long endDate);
}

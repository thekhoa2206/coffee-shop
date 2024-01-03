package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.ItemIngredient;
import com.hust.coffeeshop.models.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer>, JpaSpecificationExecutor<OrderItem> {
    @Query(value = "SELECT order_item.* FROM order_item WHERE order_id= ?1 AND status != 4", nativeQuery = true)
    List<OrderItem> findOrderItemByOrderId(int  orderId);
    @Query(value = "SELECT  order_item.* FROM order_item WHERE  product_id=?1 AND  created_on>=?2 AND created_on<=?3 AND combo=0 ", nativeQuery = true)
    List<OrderItem>  findOrderItemByIngredientId(int variantId, long startDate, long endDate);

    @Query(value = "SELECT order_item.* FROM order_item WHERE order_id in (?1) AND status != 4", nativeQuery = true)
    List<OrderItem> findOrderItemByOrderIds(List<Integer>  orderIds);

    @Query(value = "SELECT order_item.* FROM order_item WHERE id in (?1) AND status != 4", nativeQuery = true)
    List<OrderItem> findByIds(List<Integer>  ids);
}

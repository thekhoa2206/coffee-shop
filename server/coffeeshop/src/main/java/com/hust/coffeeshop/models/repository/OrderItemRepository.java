package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer>, JpaSpecificationExecutor<OrderItem> {
    @Query(value = "SELECT order_item.* FROM order_item WHERE order_id= ?1 AND status = 1", nativeQuery = true)
    List<OrderItem> findOrderByOrderId(int  orderId);

}

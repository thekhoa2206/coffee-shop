package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.Order;
import com.hust.coffeeshop.models.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository  extends JpaRepository<Order, Integer>, JpaSpecificationExecutor<Order> {
    @Query(value = "Select * from orders as o " +
            " where EXISTS (SELECT * FROM order_item as oi WHERE o.id = oi.order_id and lower(concat(oi.name, '')) like lower(?1) ) " +
            " or lower(concat(o.code, '', o.note)) like lower(?1) " +
            " or EXISTS (SELECT * FROM customer as cu WHERE o.customer_id = cu.id and lower(concat(cu.name, '', cu.phone_number)) like lower(?1) );", nativeQuery = true)
    List<Order> findOrdersByQuery(String query);

    @Query(value = "SELECT id FROM orders  ORDER BY id DESC  LIMIT 1;", nativeQuery = true)
    Integer getLastOrderId();
}

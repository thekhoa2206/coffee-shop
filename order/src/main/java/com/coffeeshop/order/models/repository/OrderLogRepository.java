package com.coffeeshop.order.models.repository;


import com.coffeeshop.order.models.entity.OrderItem;
import com.coffeeshop.order.models.entity.OrderLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderLogRepository extends JpaRepository<OrderLog, Integer>, JpaSpecificationExecutor<OrderLog> {
}

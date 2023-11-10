package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.StocktakingIngredient;
import com.hust.coffeeshop.models.entity.TableOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableOrderRepository extends JpaRepository<TableOrder, Integer>, JpaSpecificationExecutor<TableOrder> {
    @Query(value = "SELECT * FROM table_order WHERE table_id = ?1 AND status = 1", nativeQuery = true)
    TableOrder findByTableId(int tableId);
    @Query(value = "SELECT * FROM table_order WHERE order_id = ?1 AND status = 1", nativeQuery = true)
    List<TableOrder> findByOrderId(int tableId);
}

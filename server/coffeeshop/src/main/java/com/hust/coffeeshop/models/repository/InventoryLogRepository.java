package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.InventoryLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryLogRepository extends JpaRepository<InventoryLog, Integer>, JpaSpecificationExecutor<InventoryLog> {
    @Query(value = "SELECT inventory_log.* FROM inventory_log WHERE object_id=?1 AND ingredient_id =?2", nativeQuery = true)
   InventoryLog findInventoryLogByObjectId(int objectId,int ingredientId);

    @Query(value = "SELECT inventory_log.* FROM inventory_log  WHERE created_on>= ?1 AND created_on<= ?2", nativeQuery = true)
    Page<InventoryLog> findInventoryLogByDate(long startDate, long enDate, Pageable var2);
    @Query(value = "SELECT inventory_log.* FROM inventory_log  WHERE ingredient_id=?1 AND created_on>=?2 AND created_on<=?3", nativeQuery = true)
    Page<InventoryLog> findInventoryLogByIngredientId(int ingredientId,long startDate,long enDate, Pageable var2);
}

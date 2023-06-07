package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.InventoryIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryIngredientRepository extends JpaRepository<InventoryIngredient, Integer>, JpaSpecificationExecutor<InventoryIngredient> {
}

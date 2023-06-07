package com.hust.coffeeshop.models.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryIngredient extends JpaRepository<InventoryIngredient, Integer>, JpaSpecificationExecutor<InventoryIngredient> {
}

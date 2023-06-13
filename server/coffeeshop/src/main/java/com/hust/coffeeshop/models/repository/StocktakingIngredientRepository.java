package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.StocktakingIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StocktakingIngredientRepository extends JpaRepository<StocktakingIngredient, Integer>, JpaSpecificationExecutor<StocktakingIngredient> {
    @Query(value = "SELECT stocktaking_ingredient.* FROM stocktaking_ingredient WHERE stocktaking_id = ?1 AND status =1", nativeQuery = true)
    List<StocktakingIngredient> findItemIngredientByInventoryId(int stocktaking_id);
}

package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.StocktakingIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StocktakingIngredientRepository extends JpaRepository<StocktakingIngredient, Integer>, JpaSpecificationExecutor<StocktakingIngredient> {
    @Query(value = "SELECT stocktaking_ingredient.* FROM stocktaking_ingredient WHERE stocktaking_id = ?1 AND status =1   ", nativeQuery = true)
    List<StocktakingIngredient> findItemIngredientByInventoryId(int stocktaking_id);
    @Query(value = "SELECT stocktaking_ingredient.* FROM stocktaking_ingredient WHERE stocktaking_id = ?1    ", nativeQuery = true)
    List<StocktakingIngredient> findItemIngredientByStoltakingId(int stocktaking_id);

    // số lượng trong phiếu
    @Query(value = "SELECT sum(stocktaking_ingredient.quantity) FROM stocktaking_ingredient WHERE ingredient_id = ?1 AND stocktaking_id=?2 AND  created_on>=?3 AND created_on<=?4", nativeQuery = true)
    Integer CountIngredient(int ingredientId,int stocktakingId, long startDate,long endDate);
    @Query(value = "SELECT stocktaking_ingredient.* FROM stocktaking_ingredient WHERE ingredient_id = ?1 AND created_on>=?1 AND created_on<=?2  ", nativeQuery = true)
    List<StocktakingIngredient> findItemIngredientByIngredientId(int ingredient_id,long startDate, long endDate);
}

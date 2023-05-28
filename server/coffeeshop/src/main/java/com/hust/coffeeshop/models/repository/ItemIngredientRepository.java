package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.ItemIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemIngredientRepository  extends JpaRepository<ItemIngredient, Integer>, JpaSpecificationExecutor<ItemIngredient> {

}
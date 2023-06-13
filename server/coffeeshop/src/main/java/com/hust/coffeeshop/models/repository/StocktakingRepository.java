package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.Stocktaking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface StocktakingRepository extends JpaRepository<Stocktaking, Integer>, JpaSpecificationExecutor<Stocktaking> {
}

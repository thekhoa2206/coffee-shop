package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.StockUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface StockUnitRepository extends JpaRepository<StockUnit, Integer>, JpaSpecificationExecutor<StockUnit> {
}

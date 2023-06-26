package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.Stocktaking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StocktakingRepository extends JpaRepository<Stocktaking, Integer>, JpaSpecificationExecutor<Stocktaking> {
    @Query(value = "SELECT stocktakings.* FROM stocktakings WHERE created_on>=?1 AND created_on<=?2 AND type =?3 ", nativeQuery = true)
    List<Stocktaking> stocktakingByType( long startDate, long endDate, String type);
}

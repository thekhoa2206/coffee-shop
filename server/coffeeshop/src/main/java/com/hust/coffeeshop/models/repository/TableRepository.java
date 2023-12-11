package com.hust.coffeeshop.models.repository;

import com.hust.coffeeshop.models.entity.Order;
import com.hust.coffeeshop.models.entity.Table;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableRepository extends JpaRepository<Table, Integer>, JpaSpecificationExecutor<Table> {
    @Query(value = "SELECT * FROM tables where id in (?1) ", nativeQuery = true)
    List<Table> getTableByTableIds(List<Integer> tableIds);
}
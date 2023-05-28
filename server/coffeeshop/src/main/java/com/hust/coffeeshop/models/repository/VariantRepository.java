package com.hust.coffeeshop.models.repository;


import com.hust.coffeeshop.models.entity.User;
import com.hust.coffeeshop.models.entity.Variant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VariantRepository extends JpaRepository<Variant, Integer>, JpaSpecificationExecutor<Variant> {
    @Query(value = "SELECT variant.* FROM user WHERE item_id = ?1", nativeQuery = true)
    List<Variant> findUserByItemId(int itemId);
}

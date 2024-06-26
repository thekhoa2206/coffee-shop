package com.hust.coffeeshop.models.repository;



import com.hust.coffeeshop.models.entity.Variant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VariantRepository extends JpaRepository<Variant, Integer>, JpaSpecificationExecutor<Variant> {
    @Query(value = "SELECT variant.* FROM variant WHERE item_id = ?1 AND  status = 1", nativeQuery = true)
    List<Variant> findVariantByItemId(int itemId);

    @Query(value = "SELECT variant.* FROM variant WHERE id in (?1) AND  status = 1", nativeQuery = true)
    List<Variant> findVariantByIds(List<Integer> variantIds);
}

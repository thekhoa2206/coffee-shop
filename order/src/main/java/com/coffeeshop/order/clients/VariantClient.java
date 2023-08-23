package com.coffeeshop.order.clients;

import com.coffeeshop.order.models.dto.PagingListResponse;
import com.coffeeshop.order.models.dto.combo.response.ComboRespone;
import com.coffeeshop.order.models.dto.variant.VariantFilterRequest;
import com.coffeeshop.order.models.dto.variant.response.VariantRepsone;
import io.micrometer.core.annotation.Timed;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.cloud.openfeign.SpringQueryMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@FeignClient(name = "variant", url="http://localhost:9002")
public interface VariantClient {
    @RequestMapping(value = "/api/variants", method = {RequestMethod.GET})
    @Timed(percentiles = {0.95})
    PagingListResponse<VariantRepsone> filter(@SpringQueryMap VariantFilterRequest filter);
}

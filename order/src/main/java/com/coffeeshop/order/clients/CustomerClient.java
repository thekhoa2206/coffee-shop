package com.coffeeshop.order.clients;

import com.coffeeshop.order.models.dto.customer.CustomerFilterRequest;
import com.coffeeshop.order.models.dto.customer.CustomerResponse;
import io.micrometer.core.annotation.Timed;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.cloud.openfeign.SpringQueryMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@FeignClient(name = "customer", url="http://localhost:9002")
public interface CustomerClient {
    @RequestMapping(value = "/api/customers/{id}", method = {RequestMethod.GET})
    @Timed(percentiles = {0.95})
    CustomerResponse getById(@PathVariable("id") Integer id);
}

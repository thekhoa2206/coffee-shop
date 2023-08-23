package com.coffeeshop.order.clients;

import com.coffeeshop.order.models.dto.combo.ComboFilter;
import com.coffeeshop.order.models.dto.combo.response.ComboRespone;
import com.coffeeshop.order.models.dto.customer.CustomerResponse;
import com.coffeeshop.order.models.entity.ComboItem;
import io.micrometer.core.annotation.Timed;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.cloud.openfeign.SpringQueryMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@FeignClient(name = "combo", url="http://localhost:9002")
public interface ComboClient {
    @RequestMapping(value = "/api/combo/{id}", method = {RequestMethod.GET})
    @Timed(percentiles = {0.95})
    ComboRespone getById(@PathVariable("id") Integer id);

    @RequestMapping(value = "/api/combo/combo_item", method = {RequestMethod.GET})
    @Timed(percentiles = {0.95})
    List<ComboItem> getComboItemByComboIds(@SpringQueryMap ComboFilter filter);
}

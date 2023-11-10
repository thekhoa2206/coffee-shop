package com.hust.coffeeshop.controllers;


import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitFilterRequest;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitRequest;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitResponse;
import com.hust.coffeeshop.models.dto.table.TableFilterRequest;
import com.hust.coffeeshop.models.dto.table.TableRequest;
import com.hust.coffeeshop.models.dto.table.TableResponse;
import com.hust.coffeeshop.services.TableService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/table")
@CrossOrigin("http://localhost:3000")
public class TableController {
    private final TableService tableService;

    public TableController(TableService tableService) {
        this.tableService = tableService;
    }

    @GetMapping
    public PagingListResponse<TableResponse> filter(TableFilterRequest filter){
        return tableService.filter(filter);
    }
    @GetMapping("/{id}")
    public TableResponse getbyId(@PathVariable("id") int id){
        return tableService.getbyid( id);
    }
    @PostMapping
    public TableResponse create(@RequestBody TableRequest request){
        return tableService.create(request);
    }
    @PutMapping("/{id}")
    public TableResponse update(@RequestBody TableRequest request, @PathVariable("id") int id){
        return tableService.update(request, id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") int id){
        tableService.delete(id);
    }
}

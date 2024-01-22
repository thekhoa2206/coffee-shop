package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.ingredient.IngredientFilterRequest;
import com.hust.coffeeshop.models.dto.report.inventory.request.ReportInventoryRequest;
import com.hust.coffeeshop.models.dto.report.inventory.response.*;
import com.hust.coffeeshop.models.entity.InventoryLog;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.IngredientService;
import com.hust.coffeeshop.services.InventoryService;
import io.swagger.models.auth.In;
import lombok.val;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class InventoryServiceImpl implements InventoryService {
    private final IngredientRepository ingredientRepository;
    private final StockUnitRepository stockUnitRepository;
    private final InventoryLogRepository inventoryLogRepository;

    private final IngredientService ingredientService;

    public InventoryServiceImpl(IngredientRepository ingredientRepository, StockUnitRepository stockUnitRepository, InventoryLogRepository inventoryLogRepository, IngredientService ingredientService) {
        this.ingredientRepository = ingredientRepository;
        this.stockUnitRepository = stockUnitRepository;
        this.inventoryLogRepository = inventoryLogRepository;
        this.ingredientService = ingredientService;
    }

    //Hàm báo cáo kho
    @Override
    public PagingListResponse<ReportInventoryResponse> reportInventory(ReportInventoryRequest request) {
        Pageable pageable = PageRequest.of(
                request.getPage() - 1,
                request.getLimit(),
                Sort.by(Sort.Direction.DESC, "id"));
        val results = inventoryLogRepository.findInventoryLogByDate1(request.getStartDate(), request.getEndDate());
        List<ReportInventoryResponse> reportInventoryResponses = new ArrayList<>();
        List<Integer> IngredientId = results.stream()
                .map(o -> o.getIngredientId())
                .collect(Collectors.toList());
        Set<Integer> targetIngredientId = new HashSet<>(IngredientId);

        for (val dataIngredient : targetIngredientId) {
            // số lượng bán
            Integer amountDecrease = 0;
            // số lượng nhập
            Integer amountIncrease = 0;
            // số lượng xuất
            Integer amountPurchase = 0;
            //số lượng đầu kì
            Integer startAmount = 0;
            // số lượng cuối kì
            Integer endAmount = 0;
            // tìm list nguyên liệu  trong bảng log kho
            List<InventoryLog> dataNew = results.stream()
                    .filter(o -> o.getIngredientId() == dataIngredient)
                    .collect(Collectors.toList());
//            val startAmounts = dataNew.stream()
//                    .filter(o -> o.getCreatedOn() < request.getStartDate())
//                    .findFirst();
//            if (startAmounts.isPresent()) {
//                startAmount = startAmounts.get().getStockRemain();
//            }
            val endAmounts = dataNew.stream()
                    .filter(o -> o.getCreatedOn() < request.getEndDate() )
                    .findFirst();
            if (endAmounts.isPresent()) {
                endAmount = endAmounts.get().getStockRemain();
                startAmount = endAmount - (Integer.parseInt(endAmounts.get().getAmountChargeInUnit()));
            }
            //bán
            List<InventoryLog> orders = dataNew.stream()
                    .filter(o -> o.getType().equals("order"))
                    .collect(Collectors.toList());
            for (val dataOrder : orders) {
                amountDecrease += Integer.parseInt(dataOrder.getAmountChargeInUnit());
            }
            //xuất
            List<InventoryLog> exports = dataNew.stream()
                    .filter(o -> o.getType().equals("export"))
                    .collect(Collectors.toList());
            for (val dataExports : exports) {
                amountPurchase += Integer.parseInt(dataExports.getAmountChargeInUnit());
            }
            //nhập
            List<InventoryLog> imports = dataNew.stream()
                    .filter(o -> o.getType().equals("import"))
                    .collect(Collectors.toList());
            for (val dataImports : imports) {
                amountIncrease += Integer.parseInt(dataImports.getAmountChargeInUnit());
            }
            val ingredient = ingredientRepository.findById(dataIngredient);
            ReportInventoryResponse response = new ReportInventoryResponse();
            if(ingredient.isPresent()) {
                response.setIngredientId(ingredient.get().getId());
                response.setIngredientName(ingredient.get().getName());
                response.setIngredientId(ingredient.get().getId());
                BigDecimal p = new BigDecimal(endAmount);
                BigDecimal a = ingredient.get().getExportPrice().multiply(p);
                response.setTotalCode(a);
                response.setStartAmount(startAmount);
                val stockUnit = stockUnitRepository.findById(ingredient.get().getStockUnitId());
                response.setUnitName(stockUnit.get().getName());
            }
            response.setAmountDecrease(amountDecrease);
            response.setAmountIncrease(amountIncrease);
            response.setAmountPurchase(amountPurchase);
            response.setEndAmount(endAmount);

            reportInventoryResponses.add(response);
        }
        return new PagingListResponse<>(
                reportInventoryResponses,
                new PagingListResponse.Metadata(request.getPage(), request.getLimit(), targetIngredientId.size()));
    }

    //Hàm báo cáo thay đổi kho chi tiết của nguyên liệu
    @Override
    public ReportInventoryDetailResponse reportInventoryDetail(ReportInventoryRequest request, int id) {
        val ingredient = ingredientRepository.findById(id);
        if (ingredient.get() == null) throw new ErrorException("không có nguyên liệu");
        ReportInventoryDetailResponse reportInventoryDetailResponse = new ReportInventoryDetailResponse();
        reportInventoryDetailResponse.setStockEvents(stockEventsResponses(request, id));
        reportInventoryDetailResponse.setIngredientName(ingredient.get().getName());
        return reportInventoryDetailResponse;
    }

    //Hàm lấy thông tin thay đổi xuất nhập kho
    public PagingListResponse<StockEventsResponse> stockEventsResponses(ReportInventoryRequest request, int id) {
        Pageable pageable = PageRequest.of(
                request.getPage() - 1,
                request.getLimit(),
                Sort.by(Sort.Direction.DESC, "id"));
       val results = inventoryLogRepository.findInventoryLogByIngredientId(id,request.getStartDate(), request.getEndDate());
        List<StockEventsResponse> stockEventsResponses = new ArrayList<>();
        for (val data : results) {
            StockEventsResponse stockEventsResponse = new StockEventsResponse();
            stockEventsResponse.setObjectId(data.getObjectId());
            stockEventsResponse.setCode(data.getCode());
            stockEventsResponse.setCreatedOn(data.getCreatedOn());
            stockEventsResponse.setStockRemain(data.getStockRemain());
            stockEventsResponse.setAmountChargeInUnit(data.getAmountChargeInUnit());
            stockEventsResponse.setNote(data.getNote());
            //loại phiếu
            if (!data.getType().contains("order")) {
                if (data.getStatus() == 1) {
                    if (data.getType().equals("import")) {
                        stockEventsResponse.setType("Phiếu Nhập kho");
                    } else {
                        stockEventsResponse.setType("Phiếu Xuất kho");
                    }
                } else {
                    if (data.getType().equals("import")) {
                        stockEventsResponse.setType(" Huỷ phiếu nhập kho");
                    } else {
                        stockEventsResponse.setType("Huỷ phiếu xuất kho");
                    }

                }
            } else
            //đơn hàng
            {
                if (data.getStatus() == 1) {
                    stockEventsResponse.setType("Đơn hàng");
                } else {
                    stockEventsResponse.setType("Huỷ đơn hàng");
                }
            }
            stockEventsResponses.add(stockEventsResponse);
        }
        return new PagingListResponse<>(
                stockEventsResponses,
                new PagingListResponse.Metadata(request.getPage(), request.getLimit(), results.size()));

    }

    //Hàm báo cáo tồn kho
    @Override
   public ReportInventoryOnhand inventoryOnhand(ReportInventoryRequest request){
        IngredientFilterRequest filterRequest = new IngredientFilterRequest();
        filterRequest.setLimit(request.getLimit());
        filterRequest.setPage(request.getPage());
        var ingredients = ingredientService.filterIngredient(filterRequest);
        List<IngredientOnhandResponse> ingredientOnhandResponses = new ArrayList<>();
        val results = inventoryLogRepository.findInventoryLogByDate1(request.getStartDate(), request.getEndDate());
        if(ingredients.getContent() != null && !ingredients.getContent().isEmpty()){
            ingredientOnhandResponses = ingredients.getContent().stream().map(i -> {
                var inventoryLogs = results.stream().filter(r -> r.getIngredientId() == i.getId()).collect(Collectors.toList());
                int totalAmountChargeIn = inventoryLogs.stream().map(InventoryLog::getAmountChargeInUnit).collect(Collectors.toList())
                        .stream().mapToInt(Integer::parseInt).sum();
                IngredientOnhandResponse ingredient = new IngredientOnhandResponse();
                BeanUtils.copyProperties(i, ingredient);
                ingredient.setPrice(i.getExportPrice());
                ingredient.setQuantityOnhand(BigDecimal.valueOf(i.getQuantity() - totalAmountChargeIn));
                return ingredient;
            }).collect(Collectors.toList());
        }
        PagingListResponse<IngredientOnhandResponse> ingredientResponse = new PagingListResponse<>(
                ingredientOnhandResponses, new PagingListResponse.Metadata(request.getPage(), request.getLimit(), ingredients.getTotalElements()));

        ReportInventoryOnhand onhand = new ReportInventoryOnhand();
        onhand.setInventories(ingredientResponse);
        return onhand;
    }
}

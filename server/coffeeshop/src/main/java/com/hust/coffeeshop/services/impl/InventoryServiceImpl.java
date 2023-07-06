package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.report.inventory.request.ReportInventoryRequest;
import com.hust.coffeeshop.models.dto.report.inventory.response.ReportInventoryDetailResponse;
import com.hust.coffeeshop.models.dto.report.inventory.response.ReportInventoryResponse;
import com.hust.coffeeshop.models.dto.report.inventory.response.StockEventsResponse;
import com.hust.coffeeshop.models.entity.InventoryLog;
import com.hust.coffeeshop.models.entity.StocktakingIngredient;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.InventoryService;
import lombok.val;
import org.springframework.data.domain.Page;
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
    private final StocktakingIngredientRepository stocktakingIngredientRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderItemComboRepository orderItemComboRepository;
    private final ItemIngredientRepository itemIngredientRepository;
    private final IngredientRepository ingredientRepository;
    private final StocktakingRepository stocktakingRepository;
    private final StockUnitRepository stockUnitRepository;
    private final OrderRepository orderRepository;
    private final InventoryLogRepository inventoryLogRepository;

    public InventoryServiceImpl(StocktakingIngredientRepository stocktakingIngredientRepository, OrderItemRepository orderItemRepository, OrderItemComboRepository orderItemComboRepository, ItemIngredientRepository itemIngredientRepository, IngredientRepository ingredientRepository, StocktakingRepository stocktakingRepository, StockUnitRepository stockUnitRepository, OrderRepository orderRepository, InventoryLogRepository inventoryLogRepository) {
        this.stocktakingIngredientRepository = stocktakingIngredientRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderItemComboRepository = orderItemComboRepository;
        this.itemIngredientRepository = itemIngredientRepository;
        this.ingredientRepository = ingredientRepository;
        this.stocktakingRepository = stocktakingRepository;
        this.stockUnitRepository = stockUnitRepository;
        this.orderRepository = orderRepository;
        this.inventoryLogRepository = inventoryLogRepository;
    }

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
            val startAmounts = dataNew.stream()
                    .filter(o -> o.getCreatedOn() < request.getStartDate())
                    .findFirst();
            if (startAmounts.isPresent()) {
                startAmount = startAmounts.get().getStockRemain();
            }
            val endAmounts = dataNew.stream()
                    .filter(o -> o.getCreatedOn() < request.getEndDate())
                    .findFirst();
            if (endAmounts.isPresent()) {
                endAmount = endAmounts.get().getStockRemain();
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
            response.setIngredientId(ingredient.get().getId());
            response.setAmountDecrease(amountDecrease);
            response.setAmountIncrease(amountIncrease);
            response.setAmountPurchase(amountPurchase);
            response.setEndAmount(endAmount);
            response.setStartAmount(startAmount);
            response.setIngredientName(ingredient.get().getName());
            response.setIngredientId(ingredient.get().getId());
            BigDecimal p = new BigDecimal(endAmount);
            BigDecimal a = ingredient.get().getExportPrice().multiply(p);
            response.setTotalCode(a);
            val stockUnit = stockUnitRepository.findById(ingredient.get().getStockUnitId());
            response.setUnitName(stockUnit.get().getName());
            reportInventoryResponses.add(response);
        }
        return new PagingListResponse<>(
                reportInventoryResponses,
                new PagingListResponse.Metadata(request.getPage(), request.getLimit(), targetIngredientId.size()));
    }

    @Override
    public ReportInventoryDetailResponse reportInventoryDetail(ReportInventoryRequest request, int id) {
        val ingredient = ingredientRepository.findById(id);
        if (ingredient.get() == null) throw new ErrorException("không có nguyên liệu");
        ReportInventoryDetailResponse reportInventoryDetailResponse = new ReportInventoryDetailResponse();
        reportInventoryDetailResponse.setStockEvents(stockEventsResponses(request, id));
        reportInventoryDetailResponse.setIngredientName(ingredient.get().getName());
        return reportInventoryDetailResponse;
    }

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
}

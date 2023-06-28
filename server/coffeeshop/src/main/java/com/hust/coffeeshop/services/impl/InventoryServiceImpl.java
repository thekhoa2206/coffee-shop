package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.report.inventory.request.ReportInventoryRequest;
import com.hust.coffeeshop.models.dto.report.inventory.response.ReportInventoryDetailResponse;
import com.hust.coffeeshop.models.dto.report.inventory.response.ReportInventoryResponse;
import com.hust.coffeeshop.models.dto.report.inventory.response.StockEventsResponse;
import com.hust.coffeeshop.models.entity.Ingredient;
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
import java.util.List;
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

    public InventoryServiceImpl(StocktakingIngredientRepository stocktakingIngredientRepository, OrderItemRepository orderItemRepository, OrderItemComboRepository orderItemComboRepository, ItemIngredientRepository itemIngredientRepository, IngredientRepository ingredientRepository, StocktakingRepository stocktakingRepository, StockUnitRepository stockUnitRepository, OrderRepository orderRepository) {
        this.stocktakingIngredientRepository = stocktakingIngredientRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderItemComboRepository = orderItemComboRepository;
        this.itemIngredientRepository = itemIngredientRepository;
        this.ingredientRepository = ingredientRepository;
        this.stocktakingRepository = stocktakingRepository;
        this.stockUnitRepository = stockUnitRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public PagingListResponse<ReportInventoryResponse> reportInventory(ReportInventoryRequest request) {
        Pageable pageable = PageRequest.of(
                request.getPage() - 1,
                request.getLimit(),
                Sort.by(Sort.Direction.DESC, "id"));
        Page<Ingredient> results;
        results = ingredientRepository.findByDate(request.getStartDate(),request.getEndDate(),pageable);
        List<ReportInventoryResponse>  reportInventoryResponses = new ArrayList<>();
        for (val i : results){
            // số lượng bán
            Integer amountDecrease = 0;
            // số lượng nhập
            Integer amountIncrease = 0;
            // số lượng xuất
            Integer amountPurchase = 0;
            //số lượng đầu kì
            Integer startAmount = 0;
           val  startAmounts = ingredientRepository.CountbyId(request.getStartDate(),i.getId());
            if(startAmounts != null){
                startAmount = startAmounts;
            }
            // số lượng cuối kì
            Integer endAmount = 0;
            val endAmounts = ingredientRepository.CountbyId(request.getEndDate(),i.getId());
            if(endAmounts != null){
                endAmount = endAmounts;
            }
            //tìm các varianId chứa nguyên liệu
            val item = itemIngredientRepository.findItemIngredientByIngredientId(i.getId(),request.getStartDate(),request.getEndDate());
            // tìm số lượng bán

            for(val v : item){
                // tìm tại mặt hàng
                val orderItems = orderItemRepository.findOrderItemByIngredientId(v.getId(),request.getStartDate(),request.getEndDate());
                Integer count =0;
                for(val orderItem : orderItems){
                    count = count + orderItem.getQuantity();
                }
                val orderCombo = orderItemComboRepository.findItemIngredientByIngredientId(v.getId(),request.getStartDate(),request.getEndDate());
                for (val combo : orderCombo){
                    count = count + combo.getQuantity();
                }
                // số lượng bán
                amountDecrease = amountDecrease + (count * v.getAmountConsume());

            }
            // tiềm phiếu nhập
            val imports = stocktakingRepository.stocktakingByType(request.getStartDate(),request.getEndDate(),"import");
            for (  val n:imports){
                Integer countImport = 0;
                countImport = stocktakingIngredientRepository.CountIngredient(n.getId(),i.getId(),request.getStartDate(),request.getEndDate());
                if(countImport !=null){
                amountIncrease += countImport;}
            }
            // tiềm phiếu xuất
            val exports = stocktakingRepository.stocktakingByType(request.getStartDate(),request.getEndDate(),"export");
            for (  val n:exports){
                Integer countImport = 0;
                countImport = stocktakingIngredientRepository.CountIngredient(n.getId(),i.getId(),request.getStartDate(),request.getEndDate());
                if(countImport !=null){
                amountPurchase += countImport;}
            }
            ReportInventoryResponse response = new ReportInventoryResponse();
            response.setAmountDecrease(amountDecrease);
            response.setAmountIncrease(amountIncrease);
            response.setAmountPurchase(amountPurchase);
            response.setEndAmount(endAmount);
            response.setStartAmount(startAmount);
            response.setIngredientName(i.getName());
            response.setIngredientId(i.getId());
            BigDecimal p = new BigDecimal(endAmount);
            BigDecimal a = i.getExportPrice().multiply(p);
            response.setTotalCode(a);
            val stockUnit = stockUnitRepository.findById(i.getStockUnitId());
            response.setUnitName(stockUnit.get().getName());
            reportInventoryResponses.add(response);
        }
        return new PagingListResponse<>(
                reportInventoryResponses,
                new PagingListResponse.Metadata(request.getPage(), request.getLimit(), results.getTotalElements()));
    }
    @Override
    public ReportInventoryDetailResponse reportInventoryDetail(ReportInventoryRequest request, int id) {
        val ingredient= ingredientRepository.findById(id);
        if (ingredient.get() == null) throw new ErrorException("không có nguyên liệu");
        //phiếu
        val stocktakings = stocktakingIngredientRepository.findItemIngredientByIngredientId(id,request.getStartDate(),request.getEndDate());
        ReportInventoryDetailResponse reportInventoryDetailResponse = new ReportInventoryDetailResponse();
        reportInventoryDetailResponse.setStockEvents(stockEventsResponses(request,stocktakings,id));
        reportInventoryDetailResponse.setIngredientName(ingredient.get().getName());
        return reportInventoryDetailResponse;
    }

    public PagingListResponse<StockEventsResponse> stockEventsResponses(ReportInventoryRequest request, List<StocktakingIngredient> stocktakings,int id ) {

        List<StockEventsResponse> stockEventsResponses = new ArrayList<>();
        for(val s : stocktakings){
            val data = stocktakingRepository.findById(s.getId());
            StockEventsResponse stockEventsResponse = new StockEventsResponse();
            stockEventsResponse.setObjectId(data.get().getId());
            stockEventsResponse.setCode(data.get().getCode());
            stockEventsResponse.setCreatedOn(data.get().getCreatedOn());
            stockEventsResponse.setName(data.get().getName());
            stockEventsResponse.setNote(data.get().getDescription());
            //loại phiếu
            // trạng thái không phải huỷ
            if(data.get().getStatus() != 3){
                if(data.get().getType().equals("import")){
                    stockEventsResponse.setType("Phiếu Nhập kho");
                    stockEventsResponse.setAmountChargeInUnit("+"+s.getQuantity());
                }
                else {
                    stockEventsResponse.setType("Phiếu Xuất kho");
                    stockEventsResponse.setAmountChargeInUnit("-"+s.getQuantity());
                }
            }
            else {
                if(data.get().getType().equals("import")){
                    stockEventsResponse.setType(" Huỷ phiếu nhập kho");
                    stockEventsResponse.setAmountChargeInUnit("-"+s.getQuantity());
                }
                else {
                    stockEventsResponse.setType("Huỷ phiếu xuất kho");
                    stockEventsResponse.setAmountChargeInUnit("+"+s.getQuantity());
                }
            }
            stockEventsResponses.add(stockEventsResponse);
        }
        //đơn hàng
        val itemIngredient = itemIngredientRepository.findItemIngredientByIngredientId(id,request.getStartDate(),request.getEndDate());
        if(itemIngredient.size()!= 0){
            for (val i : itemIngredient){
                val itemOrders = orderItemRepository.findOrderItemByIngredientId(i.getVariantId(),request.getStartDate(),request.getEndDate());
                for(val itemOrder : itemOrders){
                    val order = orderRepository.findById(itemOrder.getId());
                    StockEventsResponse stockEventsResponse = new StockEventsResponse();
                    if(order.get() != null){
                        stockEventsResponse.setCode(order.get().getCode());
                        stockEventsResponse.setObjectId(order.get().getId());
                        stockEventsResponse.setNote(order.get().getNote());
                        Integer amountChargeInUnit = i.getAmountConsume() * itemOrder.getQuantity();
                        //nếu là phiếu huỷ
                        if(order.get().getStatus() == 4)
                        {
                            stockEventsResponse.setType("Huỷ đơn hàng");
                            stockEventsResponse.setAmountChargeInUnit("+" + amountChargeInUnit);
                        }
                        else {
                            stockEventsResponse.setType("Đơn hàng");
                            stockEventsResponse.setAmountChargeInUnit("-" + amountChargeInUnit);
                        }
                        stockEventsResponses.add(stockEventsResponse);
                    }
                }
            }
        }
        Pageable pageable = PageRequest.of(
                request.getPage() - 1,
                request.getLimit(),
                Sort.by(Sort.Direction.DESC, "id"));

        return new PagingListResponse<>(
                stockEventsResponses,
                new PagingListResponse.Metadata(request.getPage(), request.getLimit(),stockEventsResponses.size() ));

    }
}

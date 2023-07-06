package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.*;
import com.hust.coffeeshop.models.dto.PagingListResponse;
import com.hust.coffeeshop.models.dto.ingredient.IngredientResponse;
import com.hust.coffeeshop.models.dto.stocktaking.repsone.StocktakingIngredientReponse;
import com.hust.coffeeshop.models.dto.stocktaking.repsone.StocktakingReponse;
import com.hust.coffeeshop.models.dto.stocktaking.request.CreateStocktakingRequest;
import com.hust.coffeeshop.models.dto.stocktaking.request.StoctakingFilterRequest;
import com.hust.coffeeshop.models.entity.*;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.*;
import com.hust.coffeeshop.services.BaseService;
import com.hust.coffeeshop.services.StocktakingService;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StocktakingServiceImpl implements StocktakingService {
    private final StocktakingRepository stocktakingRepository;
    private final ModelMapper mapper;
    private final StocktakingIngredientRepository stocktakingIngredientRepository;
    private final IngredientRepository ingredientRepository;
    private final BaseService baseService;
    private final FilterRepository filterRepository;
    private final InventoryLogRepository inventoryLogRepository;

    public StocktakingServiceImpl(StocktakingRepository stocktakingRepository, ModelMapper mapper, StocktakingIngredientRepository stocktakingIngredientRepository, IngredientRepository ingredientRepository, BaseService baseService, FilterRepository filterRepository, InventoryLogRepository inventoryLogRepository) {
        this.stocktakingRepository = stocktakingRepository;
        this.mapper = mapper;
        this.stocktakingIngredientRepository = stocktakingIngredientRepository;
        this.ingredientRepository = ingredientRepository;
        this.baseService = baseService;
        this.filterRepository = filterRepository;
        this.inventoryLogRepository = inventoryLogRepository;
    }

    @Override
    public StocktakingReponse create(CreateStocktakingRequest request, HttpServletRequest requestHttp) {
//        var user= baseService.getuser(requestHttp);
        if (request.getName() == null) throw new ErrorException("Tên mặt hàng không được để trống");
        InventoryLog inventoryLog = new InventoryLog();
        Stocktaking stocktaking = mapper.map(request, Stocktaking.class);
        if (request.getType().equals("import")) {
            stocktaking.setCode(CommonCode.GenerateCodeWarehouse());
            stocktaking.setName(request.getName());
            if (request.getStatus() == 1) {
                stocktaking.setStatus(CommonStatus.StockingStatus.ORDER);
            }
            if (request.getStatus() == 2) {
                stocktaking.setStatus(CommonStatus.StockingStatus.WAREHOUSE);
            }

        } else {
            stocktaking.setCode(CommonCode.GenerateCodeexport());
        }
        if (request.isPayment()) {
            stocktaking.setPayment(CommonStatus.StockingPayment.ACTIVE);
        } else {
            stocktaking.setPayment(CommonStatus.StockingPayment.UNPAID);
        }
        stocktaking.setDescription(request.getDescription());
        stocktaking.setTotalMoney(request.getTotalMoney());
        stocktaking.setCreatedOn(CommonCode.getTimestamp());
        stocktaking.setModifiedOn(0);
        stocktaking.setTotalMoney(request.getTotalMoney());
        stocktaking.setType(request.getType());
        var stocktakingNew = stocktakingRepository.save(stocktaking);
        //lưu vào bảng mapping với nguyên liệu
        List<StocktakingIngredient> stocktakingIngredients = new ArrayList<>();
        if (request.getObject().size() != 0) {
            for (val i : request.getObject()) {
                StocktakingIngredient stocktakingIngredient = new StocktakingIngredient();
                stocktakingIngredient.setStocktakingId(stocktakingNew.getId());
                stocktakingIngredient.setIngredientId(i.getIngredientId());
                stocktakingIngredient.setQuantity(i.getQuantity());
                stocktakingIngredient.setIngredientMoney(i.getIngredientMoney());
                stocktakingIngredient.setStatus(CommonStatus.IngredientStatus.ACTIVE);
                stocktakingIngredient.setCreatedOn(CommonCode.getTimestamp());
                stocktakingIngredient.setModifiedOn(0);
                stocktakingIngredients.add(stocktakingIngredient);
                val ingredient = ingredientRepository.findById(i.getIngredientId());
                if (request.getType().equals("import") && request.getStatus() == 2) {

                    if (ingredient.get() == null) throw new ErrorException("lỗi liên kết kho" + i.getIngredientId());
                    ingredient.get().setQuantity(ingredient.get().getQuantity() + i.getQuantity());
                    try {
                        val ingre=  ingredientRepository.save(ingredient.get());
                        //lưu vào bảng log kho
                        inventoryLog.setCode(stocktakingNew.getCode());
                        inventoryLog.setIngredientId(i.getIngredientId());
                        inventoryLog.setObjectId(stocktakingNew.getId());
                        inventoryLog.setNote(stocktakingNew.getDescription());
                        inventoryLog.setStockRemain(ingre.getQuantity());
                        inventoryLog.setAmountChargeInUnit("+"+i.getQuantity());
                        inventoryLog.setCreatedOn(CommonCode.getTimestamp());
                        inventoryLog.setStatus(1);
                        inventoryLog.setModifiedOn(0);
                        inventoryLog.setType(request.getType());
                        inventoryLogRepository.save(inventoryLog);
                    } catch (Exception e) {
                        throw new ErrorException("liên kết kho thất bại");
                    }
                }
                if (request.getType().equals("export")) {
                    if (ingredient.get() == null) throw new ErrorException("lỗi liên kết kho" + i.getIngredientId());
                    ingredient.get().setQuantity(ingredient.get().getQuantity() - i.getQuantity());
                    try {
                        val ingre=  ingredientRepository.save(ingredient.get());
                        //lưu vào bảng log kho
                        inventoryLog.setCode(stocktakingNew.getCode());
                        inventoryLog.setIngredientId(i.getIngredientId());
                        inventoryLog.setObjectId(stocktakingNew.getId());
                        inventoryLog.setNote(stocktakingNew.getDescription());
                        inventoryLog.setStockRemain(ingre.getQuantity());
                        inventoryLog.setAmountChargeInUnit("-"+i.getQuantity());
                        inventoryLog.setCreatedOn(CommonCode.getTimestamp());
                        inventoryLog.setStatus(1);
                        inventoryLog.setModifiedOn(0);
                        inventoryLog.setType(request.getType());
                        inventoryLogRepository.save(inventoryLog);
                    } catch (Exception e) {
                        throw new ErrorException("liên kết kho thất bại");
                    }
                }
            }
            stocktakingIngredientRepository.saveAll(stocktakingIngredients);
        }
        var InventoryIngredientReponse = getIngredients(stocktakingIngredients);
        val inventoryReponse = mapper.map(stocktaking, StocktakingReponse.class);
        inventoryReponse.setObject(InventoryIngredientReponse);
        return inventoryReponse;
    }

    //api update
    @Override
    @Transactional(rollbackOn = Exception.class)
    public StocktakingReponse update(CreateStocktakingRequest request, int id, HttpServletRequest requestHttp) {
//        var user= baseService.getuser(requestHttp);
        val stocktaking = stocktakingRepository.findById(id);
        InventoryLog inventoryLog = new InventoryLog();
        if (stocktaking.get() == null) throw new ErrorException("Không tìm thấy Phiếu");
        val data = mapper.map(stocktaking.get(), Stocktaking.class);
        if (request.isPayment()) {
            data.setPayment(CommonStatus.StockingPayment.ACTIVE);
        } else {
            data.setPayment(CommonStatus.StockingPayment.UNPAID);
        }
        if (request.getDescription() != null) data.setDescription(request.getDescription());
        data.setTotalMoney(request.getTotalMoney());
        data.setModifiedOn(CommonCode.getTimestamp());
        if (request.getStatus() == 1) {
            data.setStatus(CommonStatus.StockingStatus.ORDER);
        }
        if (request.getStatus() == 2) {
            data.setStatus(CommonStatus.StockingStatus.WAREHOUSE);
        }
        var stocktakingNew = stocktakingRepository.save(data);
        val stocktakingIngredients = stocktakingIngredientRepository.findItemIngredientByInventoryId(id);
        List<StocktakingIngredient> stocktakingIngredientNews = new ArrayList<>();
        if (stocktakingIngredients.size() != 0) {
            if (request.getObject().size() != 0) {
                for (val i : request.getObject()) {
                    val stocktakingIngredient = mapper.map(i, StocktakingIngredient.class);
                    //thêm mới nguyên liệu
                    if (i.getId() == 0) {
                        stocktakingIngredient.setStocktakingId(id);
                        stocktakingIngredient.setIngredientId(i.getIngredientId());
                        stocktakingIngredient.setIngredientMoney(i.getIngredientMoney());
                        stocktakingIngredient.setStatus(CommonStatus.IngredientStatus.ACTIVE);
                        stocktakingIngredient.setQuantity(i.getQuantity());
                        stocktakingIngredient.setCreatedOn(CommonCode.getTimestamp());
                        stocktakingIngredient.setModifiedOn(0);
                        try {
                            stocktakingIngredientRepository.save(stocktakingIngredient);
                        } catch (Exception e) {
                            throw new ErrorException("Cập nhập liên kết kho thất bại");
                        }
                        val ingredient = ingredientRepository.findById(i.getIngredientId());
                        if (ingredient.get() == null)
                            throw new ErrorException("lỗi liên kết kho" + i.getIngredientId());
                        //khi trạng thái đã nhập kho hoặc xuất kho
                        if (request.getStatus() == 2) {
                            if (stocktaking.get().getType().equals("Phiếu nhập")) {
                                ingredient.get().setQuantity(ingredient.get().getQuantity() + i.getQuantity());
                                try {
                                    val ingre=  ingredientRepository.save(ingredient.get());
                                    //lưu vào bảng log kho
                                    inventoryLog.setCode(stocktakingNew.getCode());
                                    inventoryLog.setIngredientId(i.getIngredientId());
                                    inventoryLog.setObjectId(stocktakingNew.getId());
                                    inventoryLog.setNote(stocktakingNew.getDescription());
                                    inventoryLog.setStockRemain(ingre.getQuantity());
                                    inventoryLog.setAmountChargeInUnit("+"+i.getQuantity());
                                    inventoryLog.setCreatedOn(CommonCode.getTimestamp());
                                    inventoryLog.setStatus(1);
                                    inventoryLog.setModifiedOn(0);
                                    inventoryLog.setType(request.getType());
                                    inventoryLogRepository.save(inventoryLog);
                                } catch (Exception e) {
                                    throw new ErrorException("liên kết kho thất bại");
                                }
                            }
                            if (request.getType().equals("Phiếu xuất")) {
                                ingredient.get().setQuantity(ingredient.get().getQuantity() - i.getQuantity());
                                try {
                                    val ingre=  ingredientRepository.save(ingredient.get());
                                    //lưu vào bảng log kho
                                    inventoryLog.setCode(stocktakingNew.getCode());
                                    inventoryLog.setIngredientId(i.getIngredientId());
                                    inventoryLog.setObjectId(stocktakingNew.getId());
                                    inventoryLog.setNote(stocktakingNew.getDescription());
                                    inventoryLog.setStockRemain(ingre.getQuantity());
                                    inventoryLog.setAmountChargeInUnit("-"+i.getQuantity());
                                    inventoryLog.setCreatedOn(CommonCode.getTimestamp());
                                    inventoryLog.setStatus(1);
                                    inventoryLog.setModifiedOn(0);
                                    inventoryLog.setType(request.getType());
                                    inventoryLogRepository.save(inventoryLog);
                                } catch (Exception e) {
                                    throw new ErrorException("liên kết kho thất bại");
                                }

                            }
                        }

                    }
                    //cập nhật nguyên liệu
                    else {
                        var stocktakingIngredientOld = stocktakingIngredients.stream().filter(v -> v.getId().equals(i.getId())).collect(Collectors.toList()).stream().findFirst().orElse(null);
                        if (stocktakingIngredientOld != null) {
                            stocktakingIngredientOld.setQuantity(i.getQuantity());
                            stocktakingIngredientOld.setIngredientMoney(i.getIngredientMoney());
                            stocktakingIngredientOld.setModifiedOn(CommonCode.getTimestamp());
                            stocktakingIngredientNews.add(stocktakingIngredientOld);
                            val ingredient = ingredientRepository.findById(stocktakingIngredientOld.getIngredientId());
                            if (ingredient.get() == null)
                                throw new ErrorException("lỗi liên kết kho" + i.getIngredientId());
                            if (request.getStatus() == 2) {
                                if (stocktaking.get().getType().equals("Phiếu nhập")) {

                                    ingredient.get().setQuantity(ingredient.get().getQuantity() + i.getQuantity());
                                    try {
                                        val ingre=  ingredientRepository.save(ingredient.get());
                                        //lưu vào bảng log kho
                                        inventoryLog.setCode(stocktakingNew.getCode());
                                        inventoryLog.setIngredientId(i.getIngredientId());
                                        inventoryLog.setObjectId(stocktakingNew.getId());
                                        inventoryLog.setNote(stocktakingNew.getDescription());
                                        inventoryLog.setStockRemain(ingre.getQuantity());
                                        inventoryLog.setAmountChargeInUnit("+"+i.getQuantity());
                                        inventoryLog.setCreatedOn(CommonCode.getTimestamp());
                                        inventoryLog.setStatus(1);
                                        inventoryLog.setModifiedOn(0);
                                        inventoryLog.setType(request.getType());
                                        inventoryLogRepository.save(inventoryLog);
                                    } catch (Exception e) {
                                        throw new ErrorException("liên kết kho thất bại");
                                    }

                                }
                                if (stocktaking.get().getType().equals("Phiếu xuất")) {
                                    ingredient.get().setQuantity(ingredient.get().getQuantity() - i.getQuantity());
                                    try {
                                        val ingre=  ingredientRepository.save(ingredient.get());
                                        //lưu vào bảng log kho
                                        inventoryLog.setCode(stocktakingNew.getCode());
                                        inventoryLog.setIngredientId(i.getIngredientId());
                                        inventoryLog.setObjectId(stocktakingNew.getId());
                                        inventoryLog.setNote(stocktakingNew.getDescription());
                                        inventoryLog.setStockRemain(ingre.getQuantity());
                                        inventoryLog.setAmountChargeInUnit("-"+i.getQuantity());
                                        inventoryLog.setCreatedOn(CommonCode.getTimestamp());
                                        inventoryLog.setStatus(1);
                                        inventoryLog.setModifiedOn(0);
                                        inventoryLog.setType(request.getType());
                                        inventoryLogRepository.save(inventoryLog);
                                    } catch (Exception e) {
                                        throw new ErrorException("liên kết kho thất bại");
                                    }

                                }
                            }
                        }
                    }
                    //delete
                    for (val s : stocktakingIngredients) {
                        var stocktakingIngredientDelete = request.getObject().stream().filter(vq -> vq.getId() == s.getId()).collect(Collectors.toList()).stream().findFirst();
                        if (!stocktakingIngredientDelete.isPresent() || stocktakingIngredientDelete.get() == null) {
                            s.setStatus(CommonStatus.IngredientStatus.DELETED);
                            s.setModifiedOn(CommonCode.getTimestamp());
                            stocktakingIngredientNews.add(s);
                            val ingredient = ingredientRepository.findById(s.getIngredientId());
                            if (ingredient.get() == null)
                                throw new ErrorException("lỗi liên kết kho" + i.getIngredientId());
                            if (request.getStatus() == 2) {
                                if (stocktaking.get().getType().equals("Phiếu nhập")) {
                                    ingredient.get().setQuantity(ingredient.get().getQuantity() - i.getQuantity());
                                    try {
                                      val ingre=  ingredientRepository.save(ingredient.get());

                                    } catch (Exception e) {
                                        throw new ErrorException("liên kết kho thất bại");
                                    }

                                }
                                if (stocktaking.get().getType().equals("Phiếu xuất")) {
                                    ingredient.get().setQuantity(ingredient.get().getQuantity() + i.getQuantity());
                                    try {
                                        val ingre=  ingredientRepository.save(ingredient.get());
                                    } catch (Exception e) {
                                        throw new ErrorException("liên kết kho thất bại");
                                    }
                                }
                            }
                        }
                    }
                }
                if (stocktakingIngredientNews != null && stocktakingIngredientNews.size() != 0) {
                    stocktakingIngredientRepository.saveAll(stocktakingIngredientNews);
                }
            }
        }
        val stocktakingIngredient = stocktakingIngredientRepository.findItemIngredientByInventoryId(id);
        var InventoryIngredientReponse = getIngredients(stocktakingIngredient);
        val inventoryReponse = mapper.map(stocktaking, StocktakingReponse.class);
//        inventoryReponse.setCreatedBy(user.getName());
        inventoryReponse.setObject(InventoryIngredientReponse);
        return inventoryReponse;
    }

    //get theo id
    @Override
    public StocktakingReponse getbyId(int id) {
        val stocktaking = stocktakingRepository.findById(id);
        if (stocktaking.get() == null) throw new ErrorException("Không tìm thấy Phiếu");
        val stocktakingReponse = mapper.map(stocktaking.get(), StocktakingReponse.class);

        if (stocktaking.get().getStatus() == 3) {
            val stocktakingIngredients = stocktakingIngredientRepository.findItemIngredientByStoltakingId(id);
            val data = getIngredients(stocktakingIngredients);
            stocktakingReponse.setObject(data);
            return stocktakingReponse;
        } else {
            val stocktakingIngredients = stocktakingIngredientRepository.findItemIngredientByInventoryId(id);
            val data = getIngredients(stocktakingIngredients);
            stocktakingReponse.setObject(data);
            return stocktakingReponse;
        }


    }

    // xóa
    @Override
    public void delete(int id) {
        val stocktaking = stocktakingRepository.findById(id);
        if (stocktaking.get() == null) throw new ErrorException("Không tìm thấy Phiếu");
        InventoryLog inventoryLog = new InventoryLog();
        stocktaking.get().setStatus(CommonStatus.StockingStatus.DELETED);
        stocktaking.get().setModifiedOn(CommonCode.getTimestamp());
        val stocktakingIngredients = stocktakingIngredientRepository.findItemIngredientByInventoryId(id);
        if (stocktakingIngredients.size() != 0) {
            for (val data : stocktakingIngredients) {
                data.setStatus(CommonStatus.IngredientStatus.DELETED);
                var ingredient = ingredientRepository.findById(data.getIngredientId());
                if (stocktaking.get().getType().equals("import") && stocktaking.get().getStatus() == 2) {
                    ingredient.get().setQuantity(ingredient.get().getQuantity() - data.getQuantity());
                    val ingre=  ingredientRepository.save(ingredient.get());
                    //lưu vào bảng log kho
                    inventoryLog.setCode(stocktaking.get().getCode());
                    inventoryLog.setIngredientId(id);
                    inventoryLog.setObjectId(stocktaking.get().getId());
                    inventoryLog.setNote(stocktaking.get().getDescription());
                    inventoryLog.setStockRemain(ingre.getQuantity());
                    inventoryLog.setAmountChargeInUnit("-"+data.getQuantity());
                    inventoryLog.setCreatedOn(CommonCode.getTimestamp());
                    inventoryLog.setStatus(2);
                    inventoryLog.setModifiedOn(0);
                    inventoryLog.setType("import");
                    inventoryLogRepository.save(inventoryLog);
                }
                if (stocktaking.get().getType().equals("export")) {
                    ingredient.get().setQuantity(ingredient.get().getQuantity() + data.getQuantity());
                    val ingre=  ingredientRepository.save(ingredient.get());
                    //lưu vào bảng log kho
                    inventoryLog.setCode(stocktaking.get().getCode());
                    inventoryLog.setIngredientId(id);
                    inventoryLog.setObjectId(stocktaking.get().getId());
                    inventoryLog.setNote(stocktaking.get().getDescription());
                    inventoryLog.setStockRemain(ingre.getQuantity());
                    inventoryLog.setAmountChargeInUnit("+"+data.getQuantity());
                    inventoryLog.setCreatedOn(CommonCode.getTimestamp());
                    inventoryLog.setStatus(2);
                    inventoryLog.setModifiedOn(0);
                    inventoryLog.setType("export");
                    inventoryLogRepository.save(inventoryLog);
                }
                stocktakingIngredientRepository.save(data);
            }
        }
    }

    //api filter
    @Override
    public PagingListResponse<StocktakingReponse> filter(StoctakingFilterRequest filter) {
        Pageable pageable = PageRequest.of(
                filter.getPage() - 1,
                filter.getLimit(),
                Sort.by(Sort.Direction.DESC, "id"));
        var filters = new ArrayList<Filter>();

        //id
        if (filter.getIds() != null) {
            Filter ids = Filter.builder()
                    .field("id")
                    .operator(QueryOperator.IN)
                    .values(filter.getIds().stream().map(Object::toString).collect(Collectors.toList()))
                    .build();
            filters.add(ids);
        }
        //query
        if (filter.getQuery() != null && !filter.getQuery().isEmpty()) {
            Filter query = Filter.builder()
                    .field("name")
                    //.fields("name,phone_number")
                    .operator(QueryOperator.LIKE)
                    .value(filter.getQuery())
                    .build();
            filters.add(query);
        }
        //type
        if (filter.getType() != null && !filter.getType().isEmpty()) {
            Filter type = Filter.builder()
                    .field("type")
                    .operator(QueryOperator.IN)
                    .values(Arrays.asList(filter.getType().split(",")))
                    .build();
            filters.add(type);
        }
        //status
        if (filter.getStatuses() != null && !filter.getStatuses().isEmpty()) {
            Filter statuses = Filter.builder()
                    .field("status")
                    .operator(QueryOperator.IN)
                    .values(filter.getStatuses().stream().map(Object::toString).collect(Collectors.toList()))
                    .build();
            filters.add(statuses);
        }
        Page<Stocktaking> results;
        if (filters.size() > 0)
            results = stocktakingRepository.findAll(filterRepository.getSpecificationFromFilters(filters), pageable);
        else results = stocktakingRepository.findAll(pageable);
        List<StocktakingReponse> stocktakingReponses = new ArrayList<>();
        for (val i : results.getContent()
        ) {
            val stocktakingReponse = mapper.map(i, StocktakingReponse.class);
            if (stocktakingReponse.getType().equals("import")) {
                stocktakingReponse.setType("import");
            }
            if (stocktakingReponse.getType().equals("export")) {
                stocktakingReponse.setType("export");
            }
            val stocktakingIngredients = stocktakingIngredientRepository.findItemIngredientByInventoryId(i.getId());
            val data = getIngredients(stocktakingIngredients);
            stocktakingReponse.setObject(data);
            stocktakingReponses.add(stocktakingReponse);

        }

        return new PagingListResponse<>(
                stocktakingReponses,
                new PagingListResponse.Metadata(filter.getPage(), filter.getLimit(), results.getTotalElements()));
    }

    @Transactional(rollbackOn = Exception.class)
    List<StocktakingIngredientReponse> getIngredients(List<StocktakingIngredient> stocktakingIngredients) {
        if (stocktakingIngredients.size() != 0) {
            List<StocktakingIngredientReponse> stocktakingIngredientRepons = new ArrayList<>();
            for (val i : stocktakingIngredients) {
                StocktakingIngredientReponse data = new StocktakingIngredientReponse();
                data.setIngredientMoney(i.getIngredientMoney());
                data.setQuantity(i.getQuantity());
                data.setId(i.getId());
                val ingredient = ingredientRepository.findById(i.getIngredientId());
                val ingredientReponse = mapper.map(ingredient.get(), IngredientResponse.class);
                data.setIngredientResponse(ingredientReponse);
                stocktakingIngredientRepons.add(data);
            }
            return stocktakingIngredientRepons;
        } else {
            return null;
        }
    }
}

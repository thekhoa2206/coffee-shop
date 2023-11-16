package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;
import com.hust.coffeeshop.models.dto.shift.ShiftRequest;
import com.hust.coffeeshop.models.dto.shift.ShiftRespone;
import com.hust.coffeeshop.models.dto.stocktaking.repsone.StocktakingIngredientReponse;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitResponse;
import com.hust.coffeeshop.models.entity.Shift;
import com.hust.coffeeshop.models.entity.StocktakingIngredient;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.ShiftObjectRepository;
import com.hust.coffeeshop.models.repository.ShiftRepository;
import com.hust.coffeeshop.models.repository.UserRepository;
import com.hust.coffeeshop.services.ShiftService;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShiftServiceImpl implements ShiftService {
    private  final ShiftRepository shiftRepository;
    private final ModelMapper mapper;
    private final UserRepository userRepository;
    private final ShiftObjectRepository shiftObjectRepository;

    public ShiftServiceImpl(ShiftRepository shiftRepository, ModelMapper mapper, UserRepository userRepository, ShiftObjectRepository shiftObjectRepository) {
        this.shiftRepository = shiftRepository;
        this.mapper = mapper;
        this.userRepository = userRepository;
        this.shiftObjectRepository = shiftObjectRepository;
    }

    //api tạo
    @Override
    public ShiftRespone create(int userId) {
        if(userId ==0) throw new ErrorException(" user không được để trống ");
        var user = userRepository.findById(userId);
        if(!user.isPresent()) throw new ErrorException("Không tìm thấy nhân viên");
        Shift shift = new Shift();
        shift.setCode(CommonCode.GenerateCodeShift());
        shift.setShiftTurnover(BigDecimal.ZERO);
        shift.setMoneyOrder(BigDecimal.ZERO);
        shift.setTotalOrder(0);
        shift.setExport_money(BigDecimal.ZERO);
        shift.setImportMoney(BigDecimal.ZERO);
        shift.setImportTotal(0);
        shift.setMoney_cancel_order(BigDecimal.ZERO);
        shift.setTotalOrder(0);
        shift.setMoney_export_cancel(BigDecimal.ZERO);
        shift.setTotal_export_cancel(0);
        shift.setMoney_import_cancel(BigDecimal.ZERO);
        shift.setTotal_import_cancel(0);
        shift.setStatus(CommonStatus.Status.ACTIVE);
        shift.setUserStartId(userId);
        shift.setModifiedOn(0);
        shift.setCreatedOn(CommonCode.getTimestamp());
        ShiftRespone shiftRespone = null;
        try {
            var shiftNew = shiftRepository.save(shift);
            shiftRespone = mapper.map(shiftNew, ShiftRespone.class);
        } catch (Exception e) {
            throw new ErrorException("tạo ca thất bại");
        }
        shiftRespone.setUserStartId(user.get().getId());
        shiftRespone.setUserStart(user.get().getName());
        return shiftRespone;
    }
    //api get theo userId
    @Override
    public ShiftRespone getByUserId(int id) {
        if(id ==0) throw new ErrorException("Nhân viên không được để trống");
        var shiftRespone = getShift(id);
        var user = userRepository.findById(id);
        if(!user.isPresent()) throw new ErrorException("Không tìm thấy nhân viên");
        shiftRespone.setUserStartId(user.get().getId());
        shiftRespone.setUserStart(user.get().getName());
        return shiftRespone;
    }
    @Transactional(rollbackOn = Exception.class)
    ShiftRespone getShift(int user_id) {
       // tổng doanh thu ca ( tổng  tiền order + tiền phiếu xuất kho)
        BigDecimal shiftTurnover = BigDecimal.ZERO;
        // tiền đơn hàng
        BigDecimal moneyOrder = BigDecimal.ZERO;
        //tổng đơn
        int totalOrder =0;
        //tổng tiền phiếu xuất
        BigDecimal exportMoney =BigDecimal.ZERO;
        //tổng phiếu xuất
        int totalExport =0;
        // tổng tiền phiếu nhập
        BigDecimal importMoney =BigDecimal.ZERO;
        // tổng phiếu nhập
        int importTotal=0;
        // tổng tiền order huỷ
        BigDecimal money_cancel_order=BigDecimal.ZERO;
        // tổng order huỷ
        int total_order_cancel=0;
        // tổng tiền phiếu xuất huỷ
        BigDecimal money_export_cancel =BigDecimal.ZERO;
        // tổng  phiếu xuất huỷ
        int total_export_cancel=0;
        // tổng tiền phiếu nhập huỷ
        BigDecimal money_import_cancel=BigDecimal.ZERO;
        // tổng phiếu nhập
        int total_import_cancel =0;
        ShiftRespone shiftRespone = null;

        var shifts = shiftRepository.findShiftByUserId(user_id);
        if(shifts==null) throw new ErrorException("chưa mở ca làm việc");
            shiftRespone = mapper.map(shifts, ShiftRespone.class);
            var shiftOject = shiftObjectRepository.findByShiftId(shifts.getId());
            //tìm danh sách order
            val orderShift = shiftOject.stream()
                    .filter(o->o.getType().equals("order")).collect(Collectors.toList());
                if(!orderShift.isEmpty()){
                    val order = orderShift.stream()
                            .filter(o->o.getStatus()==1).collect(Collectors.toList());
                         if(!order.isEmpty()){
                            BigDecimal  orderMoneys = order.stream()
                                    .map(o->o.getMoney())
                                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                            moneyOrder =orderMoneys;
                            shiftTurnover = shiftTurnover.add(moneyOrder);
                            totalOrder = order.size();
                            shiftRespone.setShiftTurnover(shiftTurnover);
                            shiftRespone.setMoneyOrder(moneyOrder);
                            shiftRespone.setTotalOrder(totalOrder);
                        }
                    val orderCancel = orderShift.stream()
                            .filter(o->o.getStatus()==2).collect(Collectors.toList());
                        if(!orderCancel.isEmpty()) {
                            BigDecimal orderCancelMoney = orderCancel.stream()
                                    .map(o -> o.getMoney())
                                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                            money_cancel_order = orderCancelMoney;
                            total_order_cancel = orderCancel.size();
                            shiftRespone.setMoney_cancel_order(money_cancel_order);
                            shiftRespone.setTotal_order_cancel(total_order_cancel);
                        }
                }
            val exportShift = shiftOject.stream()
                    .filter(o->o.getType() =="export").collect(Collectors.toList());
                if(!exportShift.isEmpty()) {
                    val export = exportShift.stream()
                            .filter(o -> o.getStatus() == 1).collect(Collectors.toList());
                    if (!export.isEmpty()) {
                        BigDecimal exportMoneys = export.stream()
                                .map(o -> o.getMoney())
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                        exportMoney = exportMoneys;
                        shiftTurnover = shiftTurnover.add(exportMoneys);
                        totalExport = export.size();
                        shiftRespone.setExport_money(exportMoney);
                        shiftRespone.setTotalExport(totalExport);
                        shiftRespone.setShiftTurnover(shiftTurnover);
                    }
                    val exportCancel = exportShift.stream()
                            .filter(o -> o.getStatus() == 2).collect(Collectors.toList());
                    if(!exportCancel.isEmpty()){
                        BigDecimal exporCanceltMoneys = exportCancel.stream()
                                .map(o -> o.getMoney())
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                        money_export_cancel = exporCanceltMoneys;
                        total_export_cancel = export.size();
                        shiftRespone.setMoney_export_cancel(money_export_cancel);
                        shiftRespone.setTotal_export_cancel(total_export_cancel);
                    }
                }
            val importShift = shiftOject.stream()
                    .filter(o->o.getType() =="import").collect(Collectors.toList());
                if(!importShift.isEmpty()) {
                    val imports = importShift.stream()
                            .filter(o -> o.getStatus() == 1).collect(Collectors.toList());
                    if (!imports.isEmpty()) {
                        BigDecimal importMoneys = imports.stream()
                                .map(o -> o.getMoney())
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                        importMoney = importMoneys;
                        shiftTurnover = shiftTurnover.add(importMoney);
                        importTotal = imports.size();
                        shiftRespone.setImportMoney(importMoney);
                        shiftRespone.setImportTotal(importTotal);
                    }
                    val importCancel = importShift.stream()
                            .filter(o -> o.getStatus() == 2).collect(Collectors.toList());
                    if(!importCancel.isEmpty()){
                        BigDecimal exporCanceltMoneys = importCancel.stream()
                                .map(o -> o.getMoney())
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                        money_import_cancel = exporCanceltMoneys;
                        total_import_cancel = importCancel.size();
                        shiftRespone.setMoney_import_cancel(money_import_cancel);
                        shiftRespone.setTotal_import_cancel(total_import_cancel);
                    }
                }
        return shiftRespone;
    }
}

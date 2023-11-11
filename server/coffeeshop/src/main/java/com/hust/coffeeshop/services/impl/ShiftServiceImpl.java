package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.common.CommonStatus;
import com.hust.coffeeshop.models.dto.item.response.ItemRepsone;
import com.hust.coffeeshop.models.dto.shift.ShiftRequest;
import com.hust.coffeeshop.models.dto.shift.ShiftRespone;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitResponse;
import com.hust.coffeeshop.models.entity.Shift;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.ShiftObjectRepository;
import com.hust.coffeeshop.models.repository.ShiftRepository;
import com.hust.coffeeshop.models.repository.UserRepository;
import com.hust.coffeeshop.services.ShiftService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

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
    public ShiftRespone create(ShiftRequest request) {
        if(request.getUser_id() ==0) throw new ErrorException(" user không được để trống ");
        var user = userRepository.findById(request.getUser_id());
        if(user.isPresent()) throw new ErrorException("Không tìm thấy nhân viên");
        Shift shift = new Shift();
        BigDecimal shiftTurnover = BigDecimal.ZERO;
         BigDecimal moneyOrder=BigDecimal.ZERO;
         int totalOrder =0;
         BigDecimal export_money;
         int totalExport =0;
         BigDecimal importMoney =BigDecimal.ZERO;
         int importTotal=0;
         BigDecimal money_cancel_order=BigDecimal.ZERO;
         int total_order_cancel=0;
         BigDecimal money_export_cancel =BigDecimal.ZERO;
         int total_export_cancel=0;
         BigDecimal money_import_cancel=BigDecimal.ZERO;
         int total_import_cancel =0;

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
         shift.setUserStartId(user.get().getId());
         shift.setModifiedOn(0);
        ShiftRespone shiftRespone =  null;
        try {
            var shiftNew = shiftRepository.save(shift);
             shiftRespone = mapper.map(shiftNew, ShiftRespone.class);
             shiftRespone.setUserStartId(user.get().getId());
             shiftRespone.setUserStart(user.get().getName());
        } catch (Exception e) {
            throw new ErrorException("Cập nhật khách hàng thất bại");
        }
        return shiftRespone;
    }
}

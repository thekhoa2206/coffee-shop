package com.hust.coffeeshop.models.dto.order;

import com.hust.coffeeshop.common.CommonCode;
import com.hust.coffeeshop.common.NumberUtils;
import com.hust.coffeeshop.models.dto.customer.CustomerResponse;
import com.hust.coffeeshop.models.dto.user.UserResponse;
import freemarker.template.utility.DateUtil;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class OrderPrintModel {
    private String code;
    private CustomerResponse customerResponse;
    private int status;
    private BigDecimal total;
    private BigDecimal discountTotal;
    private String note;
    private int paymentStatus;
    private long createdOn;
    private long modifiedOn;
    private Date createdOnText;
    private Date modifiedOnText;
    private String storeName;
    private String storeAddress;
    private String storeProvince;
    private String storePhoneNumber;
    private String storeEmail;
    private CustomerPrintModel customer;

    private String totalAmountText;
    private String totalQuantityText;
    private String discountTotalText;
    private String totalText;

    private List<OrderItemPrintModel> lineItems;

    @Getter
    @Setter
    public static class OrderItemPrintModel {
        private int id;
        private int status;
        private boolean combo;
        private int quantity;
        private String name;
        private BigDecimal price;
        private int productId;
        private BigDecimal lineAmount;
        private String lineAmountText;
        private String priceText;
        private List<OrderVariantItemPrintModel> variantItems;
    }
    @Getter
    @Setter
    public static class CustomerPrintModel {
        private int id;
        private String name;
        private String phone;
    }
    @Getter
    @Setter
    public static class OrderVariantItemPrintModel {
        private int id;
        private String name;
        private String quantity;
        private String price;
    }

    public void setForPrintForm(){
        if(this.createdOn != 0){
            this.createdOnText = new Date(this.createdOn);
        }
        if(this.modifiedOn != 0){
            this.modifiedOnText = new Date(this.modifiedOn);
        }
        this.storeName = "Trà sữa 123";
        this.storeAddress = "70 -Lê thanh nghị - hai bà trưng - HN";
        this.storeProvince = "Hà nội";
        this.storePhoneNumber = "19001234";
        this.storeEmail = "trasua123@gmail.com";
        this.totalText = NumberUtils.getNumberEnFormat(this.total);
        this.discountTotalText = NumberUtils.getNumberEnFormat(this.discountTotal);
    }
}
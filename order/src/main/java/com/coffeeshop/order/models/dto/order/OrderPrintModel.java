package com.coffeeshop.order.models.dto.order;

import com.coffeeshop.order.common.NumberUtils;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class OrderPrintModel {
    private String code;
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
    private int totalQuantity;
    private String discountTotalText;
    private String totalText;
    private String totalTextVnd;

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
        private List<OrderVariantComboPrintModel> itemCombos;
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
    public static class OrderVariantComboPrintModel {
        private int id;
        private String name;
        private int quantity;
        private BigDecimal price;
        private String priceText;
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
        this.totalAmountText = NumberUtils.getNumberEnFormat(this.total.add(this.discountTotal != null ? this.discountTotal : BigDecimal.ZERO));
        this.discountTotalText = NumberUtils.getNumberEnFormat(this.discountTotal);
        var quantityTotal = 0;
        for (var lineItem : this.lineItems) {
            lineItem.lineAmount = lineItem.price.multiply(BigDecimal.valueOf(lineItem.quantity));
            lineItem.priceText = NumberUtils.getNumberEnFormat(lineItem.price);
            lineItem.lineAmountText = NumberUtils.getNumberEnFormat(lineItem.lineAmount);
            if(lineItem.combo){
                for (var combo : lineItem.itemCombos) {
                    quantityTotal = quantityTotal + combo.quantity;
                    combo.priceText = NumberUtils.getNumberEnFormat(combo.price);
                }
            }else quantityTotal = quantityTotal + lineItem.quantity;
        }
        this.totalTextVnd = NumberUtils.readNumber(this.total);
        this.totalQuantity = quantityTotal;

    }
}
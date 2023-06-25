package com.hust.coffeeshop.models.dto.stocktaking.request;

import com.hust.coffeeshop.models.dto.ingredient.IngredientResponse;
import com.hust.coffeeshop.models.dto.order.OrderPrintModel;
import com.hust.coffeeshop.models.dto.stocktaking.repsone.StocktakingIngredientReponse;
import com.hust.coffeeshop.models.dto.stockunit.StockUnitResponse;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class StoctakingPrintModel {
    private String name;
    private String type;
    private BigDecimal totalMoney;
    private String description;
    private int status;
    private  String code;
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
    private List<StocktakingIngredientPrintModel> object;
    @Getter
    @Setter
    public static class StocktakingIngredientPrintModel {
        private BigDecimal ingredientMoney;
        private int  quantity;
        private IngredientPrintModel ingredientResponse;
        private int id;
    }
    @Getter
    @Setter
    public static class IngredientPrintModel {
        private String name;
        private int quantity;
        private int status;
        private String stockUnitId;
        private BigDecimal exportPrice;
        private StockUnitPrintModel stockUnitResponse;
    }
    @Getter
    @Setter
    public static class StockUnitPrintModel {
        private String name;
        private int status;
    }
}

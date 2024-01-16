import { Box, Grid, Paper, Typography } from "@material-ui/core";
import Dialog from "components/Dialog";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import TableService, { TableFilterRequest, TableResponse } from "services/TableService";
import useStyles from "./DialogCreateOrder.styles";
import ProductService, { ProductFilterRequest, ProductIngredientResponse, ProductResponse, ProductVariantResponse } from "services/ProductService";
import { DataSource } from "components/Select/types";
import Image from "components/Image";
import Avatar from "react-avatar";
import { formatMoney, getMessageError } from "utilities";
import { useOrderStore } from "page/Orders/store/store";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import { TableLineItem } from "page/Orders/create/components/TableLineItem";
import OrderService, { OrderItemRequest, OrderRequest, OrderResponse } from "services/OrderService";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { CustomerResponse } from "services/CustomerService";
import { useHistory } from "react-router-dom";
import SelectInfinite from "components/Select/SelectInfinite/SelectInfinite";
import { BoxProduct } from "../BoxProduct/BoxProduct";
import { BoxTotal } from "../BoxTotal/BoxTotal";
import VariantService, { VariantFilterRequest } from "services/VariantService";
import { LineItemStore } from "page/Orders/list/Orders.types";
import { useOrderTableStore } from "page/ChannelPos/store";
export type DialogCreateOrderProps = {
    open: boolean;
    onClose: () => void;
    tables: TableResponse[];
    createOrder: () => void;
    order?: OrderResponse;
    updateOrder: () => void;
}

export const DialogCreateOrder = (props: DialogCreateOrderProps) => {
  const { open, onClose, createOrder, updateOrder, order } = props;
  const {
    addLineItem,
    updateLineItem,
    deleteLineItem,
    lineItems,
    code,
    note,
    set,
    total,
    discountTotal,
    reset,
  } = useOrderTableStore();
  const classes = useStyles();

  const [querySearchCustomer, setQuerySearchCustomer] = useState("");
  const [openDialogAddCustomer, setOpenDialogAddCustomer] = useState(false);
  const history = useHistory();
  const [dataTable, setDataTbale] = useState<any[]>([]);
  useEffect(() => {
    const initFilter: TableFilterRequest = {
      limit: undefined,
      query: undefined,
    };
    initData(initFilter);
  }, []);
  const initData = async (filters: TableFilterRequest) => {
    let res = await TableService.filter(filters);
    if (res.data)
      setDataTbale(
        res.data.data?.map((table, index) => {
          return {
            stt: index + 1,
            createdBy: table.createdBy,
            createdOn: table.createdOn,
            id: table.id,
            modifiedBy: table.modifiedBy,
            modifiedOn: table.modifiedOn,
            name: table.name,
            status: table.status,
            orderId: table.orderId
          };
        }) || [],

      );
  };

  const initProducts = () => {
    
  }
  const handleChangeTable = useCallback(
    (customer: CustomerResponse | null) => {
      set((prev) => ({ ...prev, customer: customer }));
    },
    []
  );
  const handleChangeCustomer = useCallback(
    (customer: CustomerResponse | null) => {
      set((prev) => ({ ...prev, customer: customer }));
    },
    []
  );
  useEffect(() => {
    reset();
    set((prev) => ({ ...prev, context: "create", code: null }));
  }, [])
  const totalLineAmount = () => {
    let total = 0;
    if (lineItems && lineItems.length > 0) {
      lineItems.map((item) => {
        total += item.lineAmount || 0;
      });
    }
    return total;
  };
  // useEffect(() => {
  //   set((prev) => ({
  //     ...prev,
  //     total: totalLineAmount() - (discountTotal || 0),
  //   }));
  // }, [totalLineAmount, discountTotal]);



  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  console.log("data", selectedOptions);

  useEffect(() => {
    initDataOrder();
  }, [order]);

  const initDataOrder = async() => {
    if(order){
      order.orderItemResponses?.map(async (li) => {
        let variantIds: number[] = [];

        let filter: VariantFilterRequest = {};
        let comboIds: number[] = [];
        order.orderItemResponses?.map((item) => {
            if (item.combo)
                comboIds.push(item.productId);
            else
                variantIds.push(item.productId);
        });
        if (comboIds.length > 0) {
            filter.comboIds = comboIds;
        }
        let variantRes = await VariantService.filter(filter);
        let variants: ProductVariantResponse[] = [];
        if (li.combo) {
            if (variantRes.data.data) {
                variantRes.data.data.map((v) => {
                    let ingredients = v.ingredients.map((ig) => {
                        let ingredientRq: ProductIngredientResponse = {
                            id: ig.id || 0,
                            amountConsume: ig.amountConsume,
                            createdBy: ig.createdBy,
                            createdOn: ig.createdOn,
                            ingredientId: ig.ingredientId,
                            modifiedBy: ig.modifiedBy,
                            modifiedOn: ig.modifiedOn,
                            name: ig.name,
                            quantityInventory: 0,
                        }
                        return ingredientRq;
                    })
                    variants.push({
                        id: v.id,
                        available: v.available,
                        createdBy: v.createdBy,
                        createdOn: v.createdOn,
                        ingredients: ingredients,
                        modifiedBy: v.modifiedBy,
                        modifiedOn: v.modifiedOn,
                        name: v.name,
                        price: v.price,
                        productItemId: v.itemId,
                    });
                })
            }
        }
        let lineItemStore: LineItemStore = {
            available: 0,
            combo: li.combo || false,
            price: li.price,
            productId: li.productId,
            quantity: li.quantity,
            lineAmount: li.quantity * li.price,
            name: li.name,
            variants: variants,
            id: li.id,
            status: li.status,
        }
        set((prev) => ({
            ...prev,
            lineItems: [...(prev.lineItems || []), lineItemStore]
        }))
        return lineItemStore;
    })
    set((prev) => ({
        ...prev,
        code: order.code,
        note: note,
        customer: order.customerResponse,
        discountTotal: order.discountTotal,
        total: order.total,
        order: order,
        table: order.tableResponses
    }))
    }
  }
  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        title={order?.id ? "Thêm sản phẩm cho đơn" : "Tạo mới đơn hàng"}
        onOk={() => {order?.id ? updateOrder() : createOrder()}}
        textOk={"Lưu"}
        minWidthPaper="90%"
        textCancel={"Thoát"}
        isCancel={true}
        DialogTitleProps={{
          dividerBottom: true
        }}
        children={
          <Box padding={"6px"} style={{maxHeight: 1000, display: "flex"}}>
            <Box style={{width: '75%'}}>
              <BoxProduct/>
            </Box>
            <Box style={{width: '25%', borderLeft: '2px solid #E8EAEB'}}><BoxTotal/></Box>
        </Box>
        }
      />
    </Fragment>
  );
};

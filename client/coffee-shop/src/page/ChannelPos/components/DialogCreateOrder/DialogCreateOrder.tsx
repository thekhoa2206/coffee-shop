import { Box, Grid, Paper, Typography } from "@material-ui/core";
import Dialog from "components/Dialog";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import TableService, { TableFilterRequest, TableResponse } from "services/TableService";
import useStyles from "./DialogCreateOrder.styles";
import ProductService, { ProductFilterRequest, ProductResponse } from "services/ProductService";
import { DataSource } from "components/Select/types";
import Image from "components/Image";
import Avatar from "react-avatar";
import { formatMoney, getMessageError } from "utilities";
import { useOrderStore } from "page/Orders/store/store";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import { TableLineItem } from "page/Orders/create/components/TableLineItem";
import OrderService, { OrderItemRequest, OrderRequest } from "services/OrderService";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { CustomerResponse } from "services/CustomerService";
import { useHistory } from "react-router-dom";
import SelectInfinite from "components/Select/SelectInfinite/SelectInfinite";
import { BoxProduct } from "../BoxProduct/BoxProduct";
import { BoxTotal } from "../BoxTotal/BoxTotal";
export type DialogCreateOrderProps = {
    open: boolean;
    onClose: () => void;
    tables: TableResponse[];
}

export const DialogCreateOrder = (props: DialogCreateOrderProps) => {
  const { open, onClose } = props;
  const {
    addLineItem,
    updateLineItem,
    deleteLineItem,
    lineItems,
    code,
    note,
    set,
    customer,
    total,
    discountTotal,
    reset,
  } = useOrderStore();
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

  const createOrder = async () => {
    if (!lineItems || lineItems.length === 0) {
      SnackbarUtils.error("Sản phẩm không được để trống");
      return;
    }
    if (!customer) {
      SnackbarUtils.error("Thông tin khách hàng không được để trống");
      return;
    }
    if (code && code.includes("DON")) {
      SnackbarUtils.error("Mã đơn hàng không được có tiền tố DON");
      return;
    }
    let orderLineItems: OrderItemRequest[] = [];
    let error = null;
    lineItems.forEach((i) => {
      if (i.quantity > (i.available || 0)) {
        error = "Số lượng có thể bán nhỏ hơn số lượng bán!";
      }
    });
    if (error) {
      SnackbarUtils.error(error);
      return;
    }
    lineItems.map((item) => {
      let lineItemRequest: OrderItemRequest = {
        productId: item.productId,
        combo: item.combo,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      };
      orderLineItems.push(lineItemRequest);
    });
    let tableId = selectedOptions.map((x) => (
      x.id))
    let requestOrder: OrderRequest = {
      customerId: customer.id || 0,
      note: note,
      discountTotal: discountTotal || 0,
      orderItemRequest: orderLineItems,
      code: code,
      total: total || 0,
      tableIds: tableId
    };
    try {
      let res = await OrderService.create(requestOrder);
      if (res.data) {
        SnackbarUtils.success("Tạo đơn hàng thành công!");
        history.push(`/admin/orders/${res.data.id}`);
        reset();
      }
    } catch (error) {
      SnackbarUtils.error(getMessageError(error));
    }
  };


  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  console.log("data", selectedOptions);


  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        title={"Tạo mới đơn hàng"}
        onOk={() => {}}
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

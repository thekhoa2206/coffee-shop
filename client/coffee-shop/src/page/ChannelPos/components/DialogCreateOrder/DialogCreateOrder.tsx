import { Box, Grid, Paper, Typography } from "@material-ui/core";
import Dialog from "components/Dialog";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import TableService, { TableFilterRequest, TableResponse } from "services/TableService";
import useStyles from "./DialogCreateOrder.styles";
import SelectInfinite from "components/Select/SelectInfinite";
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
  const updateText = useCallback(

    (value: string) => {
      setInputValue(value);

      if (value === '') {
        setDataTbale(dataTable);
        return;
      }
      const filterRegex = new RegExp(value, 'i');
      const resultOptions = dataTable.filter((option) =>
        option.name.includes(value),
      );
      setDataTbale(resultOptions);
    },
    [dataTable],
  );

  const updateSelection = (selected: string) => {
    let data = dataTable.filter((x) => x.id === selected)
    const map = data.reduce((t, v) => {
      const { ...rest } = v;
      t = rest;
      return t;
    }, {});
    let check = selectedOptions.filter((x) => x.id === selected)
    if (check.length > 0) {
      setSelectedOptions(selectedOptions.filter((option) => option.id !== selected))
    } else {
      setSelectedOptions([...selectedOptions, map]);
    }
    updateText('');
  };

  console.log("check", selectedOptions.map((x) => (
    x.id)));

  const removeTag = useCallback(
    (tag: string) => () => {
      const options = [...selectedOptions];
      options.splice(options.indexOf(tag), 1);
      setSelectedOptions(options);
    },
    [selectedOptions],
  );




  const checkSelected = (id: string) => {
    let data = selectedOptions.filter((option) => option.id === id)
    if (data.length > 0) {
      return true;
    }
    else return false;
  }
  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        title={"Tạo mới đơn hàng"}
        onOk={() => {}}
        textOk={"Lưu"}
        minWidthPaper="1000px"
        textCancel={"Thoát"}
        isCancel={true}
        DialogTitleProps={{
          dividerBottom: true
        }}
        children={
          <Box padding={"16px"}>
            
            <Grid item xs={12}>
            <Paper className={classes.wrapperBoxInfo}>
              <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                Thông tin sản phẩm
              </Typography>
              <Box className={classes.boxContentPaper}>
                <SelectInfinite
                  inputProps={{
                    id: "buttonF3",
                  }}
                  getOptionLabel={(item) => item?.name || ""}
                  fetchDataSource={async (filter: ProductFilterRequest) => {
                    let res = await ProductService.filter(filter);
                    const dataSource = {} as DataSource;
                      debugger
                    if (res.data.data) {
                      let products: ProductResponse[] = [];
                      res.data.data.map((item) => {
                        if (!item.combo) {
                          if (
                            item.variants != null &&
                            item.variants.length > 0
                          ) {
                            item.variants?.map((v) => {
                              let product: ProductResponse = {
                                ...item,
                                variants: [v],
                                name: `${item.name} - ${v.name}`,
                                available: v.available,
                              };
                              products.push(product);
                            });
                          }
                        } else {
                          let availables = item.variants.map(
                            (v) => v.available || 0
                          );
                          products.push({
                            ...item,
                            available: Math.min(...availables),
                          });
                        }
                      });
                      dataSource.data = products;
                      dataSource.metaData = {
                        totalPage: Math.ceil(
                          (res.data.metadata?.total || 0) / (filter.limit || 10)
                        ),
                        totalItems: res.data.metadata?.total || 0,
                      };
                    }
                    return Promise.resolve(dataSource);
                  }}
                  onQueryChange={(filter: any) => {
                    let dataSourceFilter: ProductFilterRequest = {
                      limit: 10,
                      query: filter.query,
                      page: filter.page || 1,
                      combo: true,
                    };
                    return dataSourceFilter;
                  }}
                  renderOption={(option: ProductResponse) => (
                    <Box
                      style={{
                        width: "100%",
                        lineHeight: "40px",
                        padding: "16px 0px",
                        cursor: "pointer",
                        borderBottom: "1px solid #E8EAEB",
                        display: "flex",
                      }}
                      key={option.id}
                    >
                      <Box style={{ width: "10%" }}>
                        <Box style={{ marginLeft: 10 }}>
                          {option.imageUrl ? (
                            <Image src={option.imageUrl} style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "6px"
                            }} />
                          ) : (
                            <Box
                              style={{
                                width: "40px",
                                height: "40px",
                                background: "#E8EAEB",
                                borderRadius: "6px",
                              }}
                            > <Avatar size="40" color="#B1AFAF" round="6px" name={option.name} maxInitials={2} /></Box>
                          )}
                        </Box>
                      </Box>
                      <Box style={{ width: "55%" }}>
                        <Typography>
                          {option.name} - {formatMoney(option.price || 0) + "đ"}
                        </Typography>
                        <Typography>
                          Tồn kho: {option.variants ? option?.available : 0}
                        </Typography>
                      </Box>
                      <Box style={{ width: "30%" }}></Box>
                    </Box>
                  )}
                  placeholder="Tìm kiếm mặt hàng"
                  onChange={(product: ProductResponse) => {
                    addLineItem(product);
                  }}
                  value={null}
                  className={classes.infiniteList}
                  NoResultsComponent={() => (
                    <NoResultsComponent
                      nameObject="mặt hàng"
                      helpText={"Thử thay đổi từ khóa tìm kiếm hoặc thêm mới"}
                      style={{ padding: "48px 0 84px" }}
                    />
                  )}
                />
              </Box>
              <TableLineItem />
            </Paper>
            </Grid>
            <Grid item xs={4}>

            </Grid>
        </Box>
        }
      />
    </Fragment>
  );
};

import { Box, Grid, Typography, withStyles } from "@material-ui/core";
import { AddCircleOutline } from "@material-ui/icons";
import Button from "components/Button";
import Dialog from "components/Dialog";
import InputChoiceDistrict from "components/InputChoiceDistrict";
import InputChoiceWard from "components/InputChoiceWard";
import LoadingAuth from "components/Loading/LoadingAuth";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import { GridColumn } from "components/SapoGrid/GridColumn/GridColumn";
import SapoGrid from "components/SapoGrid/SapoGrid";
import { DataResult, GridPageChangeEvent } from "components/SapoGrid/SapoGrid.type";
import { CellTemplateProps } from "components/SapoGridSticky";
import SearchBox from "components/SearchBox/SearchBox";
import ListTagFilterItem from "components/TagFilterItem";
import { TagFilterItemType } from "components/TagFilterItem/TagFilterItem.types";
import TextField from "components/TextField";
import useQueryParams from "hocs/useQueryParams";
import i18next from "i18next";
import { cloneDeep, isNil } from "lodash";
import { CustomerRequest } from "page/Order/create/CreateOrder.types";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { CustomerResponse } from "services/OrdersService";
import PartnerService, { PartnerFilterRequest } from "services/PartnerService";
import StoreService, { DistrictRequestFilter, DistrictResponse, WardResponse } from "services/StoreService";
import { AppState } from "store/store";
import {
  formatDateUTC,
  formatDateUTCToLocalDateString,
  getMessageError,
  hasPermission
} from "utilities";
import { AccountRole } from "utilities/AccountRole";
import {
  convertPredefinedToDate,
  getNameAndDatePredefined
} from "utilities/DateRangesPredefine";
import QueryUtils from "utilities/QueryUtils";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import styles from "./Customer.styles";
import {
  CustomerFilterRequest,
  CustomerProps, DialogUpdateCustomerProps,
  ICustomerQuickFilter
} from "./Customer.types";
import { DialogAddCustomer } from "./DialogAddCustomer/DialogAddCustomer";
import {
  CustomerQuickFilterOptions,
  getCustomerQuickFilterLabel
} from "./Filter/CustomerFilter.constant";
import CustomerQuickFilter from "./Filter/CustomerQuickFilter.component";

const Customer = (props: CustomerProps & PropsFromRedux) => {
  const { classes, storeContext, authState } = props;
  const location = useLocation();
  const queryParams = useQueryParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialogAddCustomer, setOpenDialogAddCustomer] = useState(false);
  const [openDialogUpdateCustomer, setOpenDialogUpdateCustomer] =
    useState(false);
  const [customerChoose, setCustomerChoose] = useState<CustomerResponse>();
  const [tagsFilterItem, setTagsFilterItem] = useState<TagFilterItemType[]>([]);
  const [data, setData] = useState<DataResult>({
    data: [],
    total: 0,
  });
  const history = useHistory();
  const t = i18next.getFixedT(null, [
    "customer",
    "error",
    "component",
    "utilities",
    "order",
    "common",
  ]);
  const getDefaultQuery = () => {
    // Không hiểu tại sao useQueryParams không dùng đk
    const currentFilter = props.history.location.search as string;
    const dataFromQuery: any = {};
    for (let searchFilter of currentFilter.slice(1).split("&")) {
      const data = searchFilter.split("=");
      dataFromQuery[data[0]] = decodeURIComponent(data[1]);
    }
    const initFilter: CustomerFilterRequest = {
      page: Number(dataFromQuery["page"]) || 1,
      limit: Number(dataFromQuery["limit"]) || undefined,
      created_on_predefined:
        dataFromQuery["created_on_predefined"] || undefined,
      created_on_min: dataFromQuery["created_on_min"] || undefined,
      created_on_max: dataFromQuery["created_on_max"] || undefined,
      query: dataFromQuery["query"] || undefined,
    };
    return initFilter;
  };
  const [filters, setFilters] = useState<CustomerFilterRequest>({
    ...getDefaultQuery(),
  });
  useEffect(() => {
    let filters = getDefaultQuery();
    initData(filters);
  }, [location.search]);
  const changeQueryString = (filters: Record<string, any>) => {
    const queryString = QueryUtils.buildQueryString(filters);
    history.replace({
      search: queryString,
    });
  };
  useEffect(() => {
    document.title = "Danh sách khách hàng";
  }, []);
  async function fetchDataFilterItems(filters: ICustomerQuickFilter) {
    let tagFilter: TagFilterItemType[] = [];
    if (!filters.created_on_predefined) {
      if (filters.created_on_max || filters.created_on_min) {
        let label = `Từ ${filters.created_on_min
          ? formatDateUTCToLocalDateString(filters.created_on_min, false)
          : `${t("trước ")}`
          } đến ${filters.created_on_max
            ? formatDateUTCToLocalDateString(filters.created_on_max, true)
            : `${t("hiện tại")}`
          }`;
        tagFilter.push({
          filterType: "created_on_max,created_on_min",
          filterName: CustomerQuickFilterOptions.CREATED_ON,
          label: `${getCustomerQuickFilterLabel(
            CustomerQuickFilterOptions.CREATED_ON
          )}: ${label}`,
        });
      }
    } else {
      if (filters.created_on_predefined) {
        tagFilter.push({
          filterType: "created_on_max,created_on_min,created_on_predefined",
          filterName: CustomerQuickFilterOptions.CREATED_ON,
          label: `${getCustomerQuickFilterLabel(
            CustomerQuickFilterOptions.CREATED_ON
          )}: ${getNameAndDatePredefined(filters.created_on_predefined)}`,
        });
      }
    }
    setTagsFilterItem(tagFilter);
  }
  const initData = async (filters: CustomerFilterRequest) => {
    if (filters.created_on_predefined) {
      const newDateCreatedOn = convertPredefinedToDate(
        filters.created_on_predefined
      );
      filters.created_on_min = formatDateUTC(newDateCreatedOn.startDate, false);
      filters.created_on_max = formatDateUTC(newDateCreatedOn.endDate, true);
    }
    fetchDataFilterItems(filters).then();
    const filter: PartnerFilterRequest = {
      limit: filters.limit || 20,
      page: filters.page || 1,
    };
    filter.created_on_min = filters.created_on_min;
    filter.created_on_max = filters.created_on_max;
    filter.status = filters.status || "active";
    filter.query = filters.query;
    if (!hasPermission([AccountRole.ADMIN], authState.user) && storeContext.store) {
      filter.store_id = storeContext.store.id;
    }
    let res = await PartnerService.filter(filter);
    if (res) {
      setData({
        data: res.data.list_partner.partnerResponses.map((item, index) => ({index: index + 1, ...item})),
        total: res.data.list_partner.metadata?.total || 0,
      });
      setLoading(false);
    }
  };

  const onSubmitFilter = (filter: ICustomerQuickFilter) => {
    filter.page = 1;
    setFilters(filter);
    changeQueryString(filter);
  };
  const onRowClick = useCallback((e, data) => {
    setCustomerChoose(data);
    setOpenDialogUpdateCustomer(true);
  }, []);

  const handlePageChange = (e: GridPageChangeEvent) => {
    setLoading(true)
    const page = e.page;
    const newParams: Record<string, any> = {
      ...Object.fromEntries(queryParams),
      page: page.page,
      limit: page.pageSize,
    };
    setFilters((prev) => ({ ...prev, limit: page.pageSize || 20, page: page.page }))
    changeQueryString(newParams);
  };
  const handleSearch = (value: any) => {
    if (!value || !value?.trim()) {
    }
    const newFilters: CustomerFilterRequest = {
      ...filters,
      page: 1,
      query: value?.trim(),
    };
    changeQueryString(newFilters);
  };
  return (
    <>
      <Box className={classes.container}>
        <Box className={classes.header}>
          <Box className={classes.headerItem} display="flex">
            {""}
          </Box>
          <Box className={classes.headerItem}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutline />}
              onClick={() => {
                setOpenDialogAddCustomer(true);
              }}
            >
              {"Thêm khách hàng khác"}
            </Button>
          </Box>
        </Box>
        <Box className={classes.listBox}>
          <Box className={classes.utilities}>
            <Box className={classes.filterAndSearchBox}>
              <SearchBox
                placeholder={"Tìm kiếm khách hàng bằng tên, sđt, mã khách hàng"}
                onSubmit={(e, value) => {handleSearch(value)}}
                value={null}
                onBlur={(value: any) => {
                  if (value !== filters.query) handleSearch(value);
                }}
                className={classes.searchbox}
              />
              <CustomerQuickFilter
                filters={filters}
                onSubmit={onSubmitFilter}
              />
            </Box>
            <Box>
              <ListTagFilterItem
                data={tagsFilterItem}
                handleClickTagFilter={(filterName) => {
                  setTimeout(() => {
                    document
                      .querySelector(`[filter-name=${filterName}]`)
                      ?.scrollIntoView();
                  }, 300);
                }}
                handleDeleteTagFilter={(filterType) => {
                  let newFilterQuery = cloneDeep(
                    filters
                  ) as CustomerFilterRequest;
                  filterType.split(",").forEach((item) => {
                    (newFilterQuery as any)[`${item}`] = undefined;
                  });
                  setFilters(newFilterQuery);
                  changeQueryString(newFilterQuery);
                }}
              />
            </Box>
          </Box>
          {loading ? (
            <LoadingAuth />
          ) : (
            <React.Fragment>
              {data.total > 0 ? (
                <SapoGrid
                  data={data}
                  page={filters?.page}
                  pageSize={filters?.limit}
                  onPageChange={handlePageChange}
                  stickyHeader
                  tableDrillDown
                  stickyHeaderTop={52}
                  onRowClick={onRowClick}
                  disablePaging={false}
                >
                  <GridColumn
                    field="index"
                    title={"STT"}
                    width={80}
                    align="center"
                  />
                  <GridColumn
                    field="code"
                    title={getCustomerQuickFilterLabel(
                      CustomerQuickFilterOptions.CODE
                    )}
                    width={150}
                    align="left"
                  />
                  <GridColumn
                    field="name"
                    title={getCustomerQuickFilterLabel(
                      CustomerQuickFilterOptions.NAME
                    )}
                    width={150}
                    align="left"
                  />
                  <GridColumn
                    field="phone"
                    title={getCustomerQuickFilterLabel(
                      CustomerQuickFilterOptions.PHONE_NUMBER
                    )}
                    width={150}
                    align="left"
                  />
                  <GridColumn
                    field="createdOn"
                    title={getCustomerQuickFilterLabel(
                      CustomerQuickFilterOptions.CREATED_ON
                    )}
                    width={100}
                    align="left"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <Typography>
                            {formatDateUTCToLocalDateString(
                              dataItem.createdOn,
                              false,
                              "DD/MM/YYYY"
                            )}
                          </Typography>
                        </>
                      );
                    }}
                  </GridColumn>
                  <GridColumn
                    field="createdOn"
                    title={getCustomerQuickFilterLabel(
                      CustomerQuickFilterOptions.MODIFIED_ON
                    )}
                    width={100}
                    align="left"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <Typography>
                            {formatDateUTCToLocalDateString(
                              dataItem.createdOn,
                              false,
                              "DD/MM/YYYY"
                            )}
                          </Typography>
                        </>
                      );
                    }}
                  </GridColumn>
                  <GridColumn
                    field="address"
                    title={getCustomerQuickFilterLabel(
                      CustomerQuickFilterOptions.ADDRESS
                    )}
                    width={150}
                    align="left"
                  />
                  <GridColumn
                    field="cityName"
                    title={getCustomerQuickFilterLabel(
                      CustomerQuickFilterOptions.CITY
                    )}
                    width={150}
                    align="left"
                  />
                  <GridColumn
                    field="districtName"
                    title={getCustomerQuickFilterLabel(
                      CustomerQuickFilterOptions.DISTRICT
                    )}
                    width={150}
                    align="left"
                  />
                  <GridColumn
                    field="wardName"
                    title={getCustomerQuickFilterLabel(
                      CustomerQuickFilterOptions.WARD
                    )}
                    width={150}
                    align="left"
                  />
                </SapoGrid>
              ) : (
                <NoResultsComponent
                  message={"Không tìm thấy kết quả"}
                  helpText={"Thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm"}
                />
              )}
            </React.Fragment>
          )}
        </Box>
      </Box>
      <DialogUpdateAccount
        initData={() => {
          initData(filters);
        }}
        onClose={() => setOpenDialogUpdateCustomer(false)}
        open={openDialogUpdateCustomer}
        customer={customerChoose}
        id={String(customerChoose?.id)}
        storeContext={storeContext}
      />
      <DialogAddCustomer
        initData={() => {
          initData(filters);
        }}
        onClose={() => setOpenDialogAddCustomer(false)}
        open={openDialogAddCustomer}
        storeContext={storeContext}
      />
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
  storeContext: state.storeContext,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(styles)(Customer));

export const DialogUpdateAccount = (props: DialogUpdateCustomerProps) => {
  const { open, onClose, id, customer, initData, storeContext } = props;
  const history = useHistory();

  const [district, setDistrict] = useState<
    DistrictResponse | null | undefined
  >();
  const [ward, setWard] = useState<WardResponse | null | undefined>();
  const [customerUpdate, setCustomerUpdate] = useState<CustomerRequest>();
  useEffect(() => {
    setCustomerUpdate({
      address: customer?.address,
      phone: customer?.phone,
      code: customer?.code,
      id: customer?.id,
      name: customer?.name,
      storeId: storeContext?.store?.id,
    });
    fetchData();
  }, [customer]);
  const fetchData = async () => {
    let fil: DistrictRequestFilter = {
      city_id: 1,
    }
    let districtRes = await StoreService.getDistricts(fil);
    let district = districtRes.data.list_district.district.find((ci) => ci.id === customer?.cityId);
    setDistrict(district);
    if (district) {
      const wardsRes = await StoreService.getWards(district.id);
      let ward = wardsRes.data.list_ward.ward.find((wr) => wr.id === customer?.wardId);
      if (ward)
        setWard(ward);
    }
  }
  const handleDelete = () => {
    PartnerService.delete(id)
      .then(async (res) => {
        if (res) {
          onClose();
          SnackbarUtils.success("Xóa nhân viên thành công!");
          initData();
        }
      })
      .catch((err) => {
        SnackbarUtils.error(getMessageError(err));
      });
  };
  const handleUpdate = () => {
    if (isNil(customerUpdate?.name)) {
      SnackbarUtils.error("Tên không được để trống!");
      return;
    }
    if (isNil(customerUpdate?.address)) {
      SnackbarUtils.error("Đia chỉ không được để trống!");
      return;
    }
    if (isNil(customerUpdate?.phone)) {
      SnackbarUtils.error("SĐT không được để trống!");
      return;
    }
    if (isNil(customerUpdate?.districtId)) {
      SnackbarUtils.error("Quận/Huyện không được để trống!");
      return;
    }
    if (isNil(customerUpdate?.wardId)) {
      SnackbarUtils.error("Phường/Xã không được để trống!");
      return;
    }
    if (customerUpdate) {
      PartnerService.update(id, customerUpdate)
        .then(async (res) => {
          if (res) {
            onClose();
            if (res.data.CustomerResponse) {
              initData();
            }
            SnackbarUtils.success("Cập nhật thông tin khách thành công!");
          }
        })
        .catch((err) => {
          SnackbarUtils.error(getMessageError(err));
        });
    }
  };
  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        title={"Cập nhật khách hàng"}
        onOk={handleUpdate}
        textOk={"Lưu"}
        textDelete={"Xóa"}
        onDelete={handleDelete}
        minWidthPaper="790px"
        DialogTitleProps={{
          dividerBottom: true
        }}
        children={

          <Box padding="16px">
            <Box>
              <Grid container xs={12} spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    name="code"
                    type="text"
                    label="Mã khách"
                    fullWidth
                    value={customerUpdate?.code}
                    onChange={(event: any) => {
                      setCustomerUpdate({
                        ...customerUpdate,
                        code: event.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="name"
                    type="text"
                    label="Tên khách hàng"
                    required
                    fullWidth
                    value={customerUpdate?.name}
                    onChange={(event: any) => {
                      setCustomerUpdate({
                        ...customerUpdate,
                        name: event.target.value,
                      });
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container xs={12} spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    name="phonenumber"
                    type="text"
                    label="SĐT khách"
                    required
                    fullWidth
                    value={customerUpdate?.phone}
                    onChange={(event: any) => {
                      const re = /^[0-9\b]+$/;
                      if (
                        event.target.value === "" ||
                        re.test(event.target.value)
                      ) {
                        setCustomerUpdate({
                          ...customerUpdate,
                          phone: event.target.value,
                        });
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="address"
                    type="text"
                    label="Địa chỉ"
                    fullWidth
                    value={customerUpdate?.address}
                    onChange={(event: any) => {
                      setCustomerUpdate({
                        ...customerUpdate,
                        address: event.target.value,
                      });
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container xs={12} spacing={2}>
                <Grid item xs={6}>
                  <Typography style={{ marginBottom: "5px" }}>Quận/Huyện</Typography>
                  <InputChoiceDistrict
                    cityId={1}
                    value={district}
                    onChange={(value: DistrictResponse | null | undefined) => {
                      debugger
                      setDistrict(value);
                      setCustomerUpdate({
                        ...customerUpdate,
                        districtId: value?.id,
                        wardId: 0,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography style={{ marginBottom: "5px" }}>Phường/Xã</Typography>
                  <InputChoiceWard
                    value={ward}
                    districtId={district?.id}
                    onChange={(value: WardResponse | null | undefined) => {
                      setWard(value);
                      setCustomerUpdate({
                        ...customerUpdate,
                        wardId: value?.id,
                      });
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        }
      />
    </Fragment>
  );
};

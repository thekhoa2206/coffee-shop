import { Box, IconButton, Typography, withStyles } from "@material-ui/core";
import { AddCircleOutline } from "@material-ui/icons";
import Button from "components/Button";
import Chip from "components/Chip/Chip.component";
import LoadingAuth from "components/Loading/LoadingAuth";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import { GridColumn } from "components/SapoGrid/GridColumn/GridColumn";
import SapoGrid from "components/SapoGrid/SapoGrid";
import { DataResult, GridPageChangeEvent } from "components/SapoGrid/SapoGrid.type";
import { CellTemplateProps } from "components/SapoGridSticky";
import SearchBox from "components/SearchBox/SearchBox";
import { TagFilterItemType } from "components/TagFilterItem/TagFilterItem.types";
import useQueryParams from "hocs/useQueryParams";
import React, { useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { CustomerFilterRequest, CustomerResponse } from "services/CustomerService";
import CustomerService from "services/CustomerService/CustomerService";
import { AppState } from "store/store";
import {
  formatDateUTCToLocalDateString, getMessageError
} from "utilities";
import {
  getNameAndDatePredefined
} from "utilities/DateRangesPredefine";
import QueryUtils from "utilities/QueryUtils";
import styles from "./Customer.styles";
import {
  CustomerProps,
  ICustomerQuickFilter
} from "./Customer.types";
import {
  CustomerQuickFilterOptions,
  getCustomerQuickFilterLabel
} from "./Filter/CustomerFilter.constant";
import { DialogAddCustomer } from "./DialogAddCustomer/DialogAddCustomer";
import { DialogEditCustomer } from "./DialogAddCustomer/DialogEditCustomer";
import { CloseIcon } from "components/SVG";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import useModal from "components/Modal/useModal";
import ConfirmDialog from "components/Dialog/ConfirmDialog/ConfirmDialog";

const Customer = (props: CustomerProps & PropsFromRedux) => {
  const { classes, authState } = props;
  const location = useLocation();
  const queryParams = useQueryParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialogAddCustomer, setOpenDialogAddCustomer] = useState(false);
  const [openDialogEditCustomer, setOpenDialogCustomer] = useState(false);
  const [selected, setSelected] = useState<CustomerResponse>();
  const [tagsFilterItem, setTagsFilterItem] = useState<TagFilterItemType[]>([]);
  const { closeModal, confirm, openModal } = useModal();
  const [data, setData] = useState<DataResult>({
    data: [],
    total: 0,
  });
  const history = useHistory();
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
          : "trước "
          } đến ${filters.created_on_max
            ? formatDateUTCToLocalDateString(filters.created_on_max, true)
            : `hiện tại`
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
    let res = await CustomerService.filter(filters);
    if (res.data) setData({
      data: res.data.data?.map((item, index) => {
        return {
          stt: index + 1,
          createdBy: item.createdBy,
          createdOn: item.createdOn,
          dob: item.dob,
          id: item.id,
          modifiedBy: item.modifiedBy,
          modifiedOn: item.modifiedOn,
          name: item.name,
          phoneNumber: item.phoneNumber,
          sex: item.sex,
          status: item.status,
        }
      }) || [], total: res.data.metadata?.total || 0
    })
    setLoading(false)
  };

  // const onSubmitFilter = (filter: ICustomerQuickFilter) => {
  //   filter.page = 1;
  //   setFilters(filter);
  //   changeQueryString(filter);
  // };
  // const onRowClick = useCallback((e, data) => {
  //   setOpenDialogUpdateCustomer(true);
  // }, []);

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
    setFilters((prev) => ({ ...prev, query: value?.trim() }))
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
                setOpenDialogCustomer(true);
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
                onSubmit={(e, value) => { handleSearch(value) }}
                value={null}
                onBlur={(value: any) => {
                  if (value !== filters.query) handleSearch(value);
                }}
                className={classes.searchbox}
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
                  onRowClick={(e, data) => { setSelected(data); setOpenDialogAddCustomer(true) }}
                  disablePaging={false}
                >
                  <GridColumn
                    field="stt"
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
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <Typography>
                            {"KH" + dataItem.stt}
                          </Typography>
                        </>
                      );
                    }}
                  </GridColumn>
                  <GridColumn
                    field="name"
                    title={getCustomerQuickFilterLabel(
                      CustomerQuickFilterOptions.NAME
                    )}
                    width={150}
                    align="left"
                  />
                  <GridColumn
                    field="phoneNumber"
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
      <DialogEditCustomer open={openDialogAddCustomer} onClose={() => setOpenDialogAddCustomer(false)} initData={() => {
        initData(filters);
      }}
        customer={selected}

      />
      <DialogAddCustomer open={openDialogEditCustomer} onClose={() => setOpenDialogCustomer(false)} initData={() => {
        initData(filters);
      }} />

    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(styles)(Customer));


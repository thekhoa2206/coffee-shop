import { Box, Link, Typography, WithStyles, withStyles } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { AppState } from "store/store";
import styles from "./Stores.styles";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import Button from "components/Button";
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import Tabs from "components/Tabs";
import SearchBox from "components/SearchBox/SearchBox";
import LoadingAuth from "components/Loading/LoadingAuth";
import SapoGrid from "components/SapoGrid/SapoGrid";
import { CellTemplateProps } from "components/SapoGridSticky";
import { GridColumn } from "components/SapoGrid/GridColumn/GridColumn";
import { convertDateUTCToLocalDate, formatDateUTC, formatDateUTCToLocalDateString, formatMoney } from "utilities";
import { DataResult } from "components/SapoGrid/SapoGrid.type";
import { useHistory, useLocation } from "react-router-dom";
import AccountService, { AccountFilter, AccountFilterModel, AccountFilterRequest } from "services/AccountService";
import { colorGreen, colorInk, colorRed } from "theme/palette";
import ListTagFilterItem from "components/TagFilterItem";
import { cloneDeep } from "lodash";
import { TagFilterItemType } from "components/TagFilterItem/TagFilterItem.types";
import { convertPredefinedToDate, getNameAndDatePredefined, getNamePredefinedDate } from "utilities/DateRangesPredefine";
import i18next from "i18next";
import QueryUtils from "utilities/QueryUtils";
import { IAccountQuickFilter } from "page/Account/AccountFilter/AccountQuickFilter.type";
import { AccountQuickFilterOptions, AccountStatus, getAccountQuickFilterLabel, getAccountStatusName } from "page/Account/AccountFilter/AccountQuickFilter.consant";
import StoreService, { StoreFilterRequest, StoresFilterRequest } from "services/StoreService";
import { getStoreQuickFilterLabel, StoreQuickFilterOptions } from "./storeFilter/StoreQuickFilterOptions";
import useQueryParams from "hocs/useQueryParams";

export interface AccountsProps extends WithStyles<typeof styles> {
  history: any;
}

const Stores = (props: AccountsProps & PropsFromRedux) => {
  const { classes } = props;
  const location = useLocation();
  const queryParams = useQueryParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [tagsFilterItem, setTagsFilterItem] = useState<TagFilterItemType[]>([]);
  const [data, setData] = useState<DataResult>({
    data: [],
    total: 0,
  });
  const history = useHistory();
  const t = i18next.getFixedT(null, ["customer", "error", "component", "utilities", "order", "common"]);
  const getDefaultQuery = () => {
    // Không hiểu tại sao useQueryParams không dùng đk
    const currentFilter = props.history.location.search as string;
    const dataFromQuery: any = {};
    for (let searchFilter of currentFilter.slice(1).split("&")) {
      const data = searchFilter.split("=");
      dataFromQuery[data[0]] = decodeURIComponent(data[1]);
    }
    const initFilter: StoresFilterRequest = {
      page: Number(dataFromQuery["page"]) || 1,
      limit: Number(dataFromQuery["limit"]) || undefined,
      statuses: dataFromQuery["statuses"] || undefined,
      created_on_predefined: dataFromQuery["created_on_predefined"] || undefined,
      created_on_min: dataFromQuery["created_on_min"] || undefined,
      created_on_max: dataFromQuery["created_on_max"] || undefined,
      query: dataFromQuery["query"] || undefined,
    };
    return initFilter;
  };
  const [filters, setFilters] = useState<StoresFilterRequest>({ ...getDefaultQuery() });
  useEffect(() => {
    let filters = getDefaultQuery();
    initData(filters)
  }, [])
  const changeQueryString = (filters: Record<string, any>) => {
    const queryString = QueryUtils.buildQueryString(filters);
    history.replace({
      search: queryString,
    });
  };
  useEffect(() => {
    document.title = "Danh sách cửa hàng";
  }, []);

  const onSubmitFilter = (filter: StoresFilterRequest) => {
    filter.page = 1;
    setFilters(filter);
    changeQueryString(filter)
  };
  const onRowClick = useCallback((e, data) => {
    history.push(`/admin/stores/${data.id}`);
  }, []);

  const initData = async (filters: StoresFilterRequest) => {
    let filter: StoreFilterRequest = {
      created_on_max: filters.created_on_max,
      created_on_min: filters.created_on_min,
      ids: filters.ids,
      limit: filters.limit,
      page: filters.page,
      query: filters.query,
      statuses: filters.statuses || "active"
    }
    let res = await StoreService.filter(filter);
    if (res) {
      setData({
        data: res.data.list_store.stores.map((item, index) => ({ index: index + 1, ...item })),
        total: res.data.list_store.metadata?.total || 0,
      })
      setLoading(false)
    }
  }
  const handleSearch = (value: any) => {
    if (!value || !value?.trim()) {
    }
    const newFilters: StoresFilterRequest = {
      ...filters,
      page: 1,
      query: value?.trim(),
    };
    changeQueryString(newFilters);
  };
  return <>
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
              history.push(`/admin/stores/create`)
            }}
          >
            {"Thêm cửa hàng khác"}
          </Button>
        </Box>
      </Box>
      <Box className={classes.listBox}>
        <Box className={classes.utilities}>
          <Box className={classes.filterAndSearchBox}>
            <SearchBox
              placeholder={"Tìm kiếm cửa hàng bằng tên, email, sđt cửa hàng"}
              onSubmit={(e, value) => { handleSearch(value) }}
              value={null}
              onBlur={(value: any) => {
                if (value !== filters.query) handleSearch(value);
              }} className={classes.searchbox}
            />
          </Box>
          <Box>
            <ListTagFilterItem
              data={tagsFilterItem}
              handleClickTagFilter={(filterName) => {
                setTimeout(() => {
                  document.querySelector(`[filter-name=${filterName}]`)?.scrollIntoView();
                }, 300);
              }}
              handleDeleteTagFilter={(filterType) => {
                let newFilterQuery = cloneDeep(filters) as AccountFilterRequest;
                filterType.split(",").forEach((item) => {
                  (newFilterQuery as any)[`${item}`] = undefined;
                });
                setFilters(newFilterQuery);
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
                onPageChange={() => { }}
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
                  field="label"
                  title={getStoreQuickFilterLabel(StoreQuickFilterOptions.LABEL)}
                  width={150}
                  align="left"
                />
                <GridColumn
                  field="email"
                  title={getStoreQuickFilterLabel(StoreQuickFilterOptions.EMAIL)}
                  width={150}
                  align="left"
                />
                <GridColumn
                  field="address"
                  title={getStoreQuickFilterLabel(StoreQuickFilterOptions.ADDRESS)}
                  width={150}
                  align="left"
                />
                <GridColumn
                  field="phoneNumber"
                  title={getStoreQuickFilterLabel(StoreQuickFilterOptions.PHONE_NUMBER)}
                  width={150}
                  align="left"
                ></GridColumn>
                <GridColumn
                  field="wardName"
                  title={getStoreQuickFilterLabel(StoreQuickFilterOptions.WARD_NAME)}
                  width={150}
                  align="left"
                ></GridColumn>
                <GridColumn
                  field="districtName"
                  title={getStoreQuickFilterLabel(StoreQuickFilterOptions.DISTRICT_NAME)}
                  width={150}
                  align="left"
                ></GridColumn>
                <GridColumn
                  field="cityName"
                  title={getStoreQuickFilterLabel(StoreQuickFilterOptions.CITY_NAME)}
                  width={150}
                  align="left"
                ></GridColumn>
                <GridColumn
                  field="createdOn"
                  title={getStoreQuickFilterLabel(StoreQuickFilterOptions.CREATED_ON)}
                  width={100}
                  align="left"
                >
                  {({ dataItem }: CellTemplateProps) => {
                    return (
                      <>
                        <Typography>
                          {formatDateUTCToLocalDateString(dataItem.createdOn, false, "DD/MM/YYYY")}
                        </Typography>
                      </>
                    );
                  }}
                </GridColumn>
                <GridColumn
                  field="modifiedOn"
                  title={getStoreQuickFilterLabel(StoreQuickFilterOptions.MODIFIED_ON)}
                  width={150}
                  align="left"
                >
                  {({ dataItem }: CellTemplateProps) => {
                    return (
                      <>
                        <Typography>
                          {formatDateUTCToLocalDateString(dataItem.modifiedOn, false, "DD/MM/YYYY")}
                        </Typography>
                      </>
                    );
                  }}
                </GridColumn>
                <GridColumn
                  field="totalRevenue"
                  title={getStoreQuickFilterLabel(StoreQuickFilterOptions.TOTAL_REVENUE)}
                  width={150}
                  align="left"
                >
                  {({ dataItem }: CellTemplateProps) => {
                    return (
                      <>
                        <Typography>
                          {formatMoney(dataItem.totalRevenue)}
                        </Typography>
                      </>
                    );
                  }}
                </GridColumn>
                <GridColumn
                  field="totalShipFee"
                  title={getStoreQuickFilterLabel(StoreQuickFilterOptions.TOTAL_FEE)}
                  width={150}
                  align="left"
                >
                  {({ dataItem }: CellTemplateProps) => {
                    return (
                      <>
                        <Typography>
                          {formatMoney(dataItem.totalShipFee)}
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
  </>;
};

const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(styles)(Stores));
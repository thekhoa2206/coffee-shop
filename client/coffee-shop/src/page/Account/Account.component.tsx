import { Box, Link, Typography, WithStyles, withStyles } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { AppState } from "store/store";
import styles from "./Account.styles";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import Button from "components/Button";
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import Tabs from "components/Tabs";
import SearchBox from "components/SearchBox/SearchBox";
import LoadingAuth from "components/Loading/LoadingAuth";
import SapoGrid from "components/SapoGrid/SapoGrid";
import { CellTemplateProps } from "components/SapoGridSticky";
import { GridColumn } from "components/SapoGrid/GridColumn/GridColumn";
import { AccountQuickFilterOptions, AccountStatus, getAccountQuickFilterLabel, getAccountStatusName } from "./AccountFilter/AccountQuickFilter.consant";
import { convertDateUTCToLocalDate, formatDateUTC, formatDateUTCToLocalDateString } from "utilities";
import { DataResult, GridPageChangeEvent } from "components/SapoGrid/SapoGrid.type";
import AccountQuickFilter from "./AccountFilter/AccountQuickFilter.component";
import { IAccountQuickFilter } from "./AccountFilter/AccountQuickFilter.type";
import { useHistory, useLocation } from "react-router-dom";
import AccountService, { AccountFilter, AccountFilterModel, AccountFilterRequest } from "services/AccountService";
import { colorGreen, colorInk, colorRed } from "theme/palette";
import ListTagFilterItem from "components/TagFilterItem";
import { cloneDeep } from "lodash";
import { TagFilterItemType } from "components/TagFilterItem/TagFilterItem.types";
import { convertPredefinedToDate, getNameAndDatePredefined, getNamePredefinedDate } from "utilities/DateRangesPredefine";
import i18next from "i18next";
import QueryUtils from "utilities/QueryUtils";
import useQueryParams from "hocs/useQueryParams";

export interface AccountsProps extends WithStyles<typeof styles> {
  history: any;
}

const Account = (props: AccountsProps & PropsFromRedux) => {
  const { classes } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [tagsFilterItem, setTagsFilterItem] = useState<TagFilterItemType[]>([]);
  const [data, setData] = useState<DataResult>({
    data: [],
    total: 0,
  });
  const location = useLocation();
  const queryParams = useQueryParams();
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
    const initFilter: AccountFilterRequest = {
      page: Number(dataFromQuery["page"]) || 1,
      limit: Number(dataFromQuery["limit"]) || undefined,
      status: dataFromQuery["status"] || undefined,
      created_on_predefined: dataFromQuery["created_on_predefined"] || undefined,
      created_on_min: dataFromQuery["created_on_min"] || undefined,
      created_on_max: dataFromQuery["created_on_max"] || undefined,
      query: dataFromQuery["query"] || undefined,
    };
    return initFilter;
  };
  const [filters, setFilters] = useState<AccountFilterRequest>({ ...getDefaultQuery() });
  useEffect(() => {
    let filters = getDefaultQuery();
    initData(filters)
  }, [location.search])
  const changeQueryString = (filters: Record<string, any>) => {
    const queryString = QueryUtils.buildQueryString(filters);
    history.replace({
      search: queryString,
    });
  };
  useEffect(() => {
    document.title = "Danh sách nhân viên";
  }, []);
  async function fetchDataFilterItems(filters: IAccountQuickFilter) {
    let tagFilter: TagFilterItemType[] = []
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
          filterName: AccountQuickFilterOptions.CREATED,
          label: `${getAccountQuickFilterLabel(AccountQuickFilterOptions.CREATED)}: ${label}`,
        });
      }
    } else {
      if (filters.created_on_predefined) {
        tagFilter.push({
          filterType: "created_on_max,created_on_min,created_on_predefined",
          filterName: AccountQuickFilterOptions.CREATED,
          label: `${getAccountQuickFilterLabel(
            AccountQuickFilterOptions.CREATED
          )}: ${getNameAndDatePredefined(filters.created_on_predefined)}`,
        });
      }
    }
    if (filters.status) {
      let statuses = filters.status.split(",");
      let label = statuses.map((item) => getAccountStatusName(item)).join(", ");
      tagFilter.push({
        filterType: "status",
        label: `${getAccountQuickFilterLabel(AccountQuickFilterOptions.STATUS)}: ${label}`,
        filterName: AccountQuickFilterOptions.STATUS,
      });
    }
    setTagsFilterItem(tagFilter);
  }
  const initData = async (filters: AccountFilterRequest) => {
    if (filters.created_on_predefined) {
      const newDateCreatedOn = convertPredefinedToDate(filters.created_on_predefined);
      filters.created_on_min = formatDateUTC(newDateCreatedOn.startDate, false);
      filters.created_on_max = formatDateUTC(newDateCreatedOn.endDate, true);
    }
    fetchDataFilterItems(filters).then();;
    const accountFilter: AccountFilter = { limit: filters.limit || 20, page: filters.page || 1 };
    accountFilter.created_on_min = filters.created_on_min;
    accountFilter.created_on_max = filters.created_on_max;
    accountFilter.status = filters.status || "active,inactive,invite";
    accountFilter.typeAccount =  "staff,ship";
    accountFilter.query = filters.query;
    let res = await AccountService.filter(accountFilter);
    if (res) {
      setData({
        data: res.data.list_accounts_response.account_response.map((item, index) => ({index: index + 1, ...item})),
        total: res.data.list_accounts_response.metadata?.total || 0,
      })
      setLoading(false)
    }
  }

  const getAccountStatus = (account: any) => {
    if (!account) {
      return undefined;
    }
    let name = getAccountStatusName(account.status);
    let color = colorInk.primary;
    switch (account.status) {
      case AccountStatus.INACTIVE:
        color = colorRed.primary.main;
        break;
      case AccountStatus.ACTIVE:
      case AccountStatus.INVITE:
        color = colorGreen.primary.main;
        break;
    }
    return { name, color };
  };

  const onSubmitFilter = (filter: IAccountQuickFilter) => {
    filter.page = 1;
    setFilters(filter);
    changeQueryString(filter);
  };
  const onRowClick = useCallback((e, data) => {
    history.push(`/admin/accounts/${data.id}`);
  }, []);

  const handleSearch = (value: any) => {
    if (!value || !value?.trim()) {
    }
    const newFilters: IAccountQuickFilter = {
      ...filters,
      page: 1,
      query: value?.trim(),
    };
    changeQueryString(newFilters);
  };

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
              history.push(`/admin/accounts/create`)
            }}
          >
            {"Thêm nhân viên khác"}
          </Button>
        </Box>
      </Box>
      <Box className={classes.listBox}>
        <Box className={classes.utilities}>
          <Box className={classes.filterAndSearchBox}>
            <SearchBox
              placeholder={"Tìm kiếm nhân viên"}
              onSubmit={(e, value) => {handleSearch(value)}}
              value={null}
              onBlur={(value: any) => {
                if (value !== filters.query) handleSearch(value);
              }} className={classes.searchbox}
            />
            <AccountQuickFilter
              filters={filters}
              onSubmit={onSubmitFilter} />
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
                stickyHeader
                tableDrillDown
                stickyHeaderTop={52}
                onRowClick={onRowClick}
                disablePaging={false}
                onPageChange={handlePageChange}
              >
                <GridColumn
                    field="index"
                    title={"STT"}
                    width={50}
                    align="center"
                  />
                <GridColumn
                  field="fullName"
                  title={getAccountQuickFilterLabel(AccountQuickFilterOptions.NAME)}
                  width={150}
                  align="left"
                />
                <GridColumn
                  field="phoneNo"
                  title={getAccountQuickFilterLabel(AccountQuickFilterOptions.PHONE_NUMBER)}
                  width={150}
                  align="left"
                />
                <GridColumn
                  field="email"
                  title={getAccountQuickFilterLabel(AccountQuickFilterOptions.EMAIL)}
                  width={150}
                  align="left"
                />
                <GridColumn
                  field="status"
                  title={getAccountQuickFilterLabel(AccountQuickFilterOptions.STATUS)}
                  width={150}
                  align="left"
                >
                  {({ dataItem }: CellTemplateProps) => {
                    const accountStatus = getAccountStatus(dataItem);
                    return accountStatus ? (
                      <Typography style={{ color: accountStatus.color }}>{accountStatus.name}</Typography>
                    ) : null;
                  }}
                </GridColumn>
                <GridColumn
                  field="createdOn"
                  title={getAccountQuickFilterLabel(AccountQuickFilterOptions.CREATED)}
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
                  field="address"
                  title={getAccountQuickFilterLabel(AccountQuickFilterOptions.ADDRESS)}
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
  </>;
};

const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(styles)(Account));
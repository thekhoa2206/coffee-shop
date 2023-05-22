import { withStyles, WithStyles } from "@material-ui/styles";

import AccountService, { AccountFilter, AccountResponse } from "../../../services/AccountService";
import React, { Fragment, useEffect, useState } from "react";
import { AppState } from "../../../store/store";
import { connect } from "react-redux";
import Box from "@material-ui/core/Box";
import Tabs from "../../../components/Tabs/Tabs.component";
import Tab from "../../../components/Tabs/Tab/Tab.component";
import { ITab } from "../../../components/Tabs/Tabs.types";
import TabLabel from "../../../components/Tabs/TabLabel/TabLabel";
import QueryUtils from "../../../utilities/QueryUtils";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import LoadingAuth from "../../../components/Loading/LoadingAuth";
import { CellTemplateProps, DataResult, GridPageChangeEvent } from "../../../components/SapoGrid/SapoGrid.type";
import { formatDateUTCToLocalDateString } from "../../../utilities";

import NoResultsComponent from "../../../components/NoResults/NoResultsComponent";
import _ from "lodash";
import { AuthState } from "../../../store/Authenticate/types";

import { useIsMount } from "hocs/useIsMount";
import { GridColumn } from "../../../components/SapoGrid/GridColumn/GridColumn";
import { Link, Typography } from "@material-ui/core";
import TooltipComponent from "components/Tooltip/Tooltip.component";
import Button from "../../../components/Button";
import AddIcon from "@material-ui/icons/Add";

import SapoGrid from "components/SapoGrid/SapoGrid";
import { getRoleQuickFilterLabel, RoleQuickFilterOptions } from "./RoleQuickFilter/RoleQuickFilter.consant";
import { IRoleQuickFilter } from "./RoleQuickFilter/RoleQuickFilter.type";
import styles from "./Role.styles";
import { AccountStatus } from "../AccountFilter/AccountQuickFilter.consant";

export interface RolesProps extends WithStyles<typeof styles> {
  history: any;
  user: AccountResponse;
  authState: AuthState;
}

const Role = (props: RolesProps) => {
  const { classes, authState } = props;
  const [tabs, setTabs] = useState<ITab[]>([]);

  const getDefaultQuery = () => {
    // Không hiểu tại sao useQueryParams không dùng đk
    const currentFilter = props.history.location.search as string;
    const dataFromQuery: any = {};
    for (let searchFilter of currentFilter.slice(1).split("&")) {
      const data = searchFilter.split("=");
      dataFromQuery[data[0]] = decodeURIComponent(data[1]);
    }
    const initFilter: IRoleQuickFilter = {
      page: Number(dataFromQuery["page"]) || undefined,
      limit: Number(dataFromQuery["limit"]) || undefined,
      created_on_predefined: dataFromQuery["created_on_predefined"] || undefined,
      created_on_min: dataFromQuery["created_on_min"] || undefined,
      created_on_max: dataFromQuery["created_on_max"] || undefined,
    };
    return initFilter;
  };
  const [filters, setFilters] = useState<IRoleQuickFilter>({ ...getDefaultQuery() });
  const { t } = useTranslation(["_roles", "error", "component", "utilities"]);
  const [tabActive, setTabActive] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [savedSearchTabs, setSavedSearchTabs] = useState<ITab[]>([]);
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [data, setData] = useState<DataResult>({
    data: [],
    total: 0,
  });
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    document.title = "Phân quyền vai trò";
    
  }, []);


  const changeQueryString = (filters: Record<string, any>) => {
    const queryString = QueryUtils.buildQueryString(filters);
    history.replace({
      search: queryString,
    });
  };

  const handlePageChange = (e: GridPageChangeEvent) => {
    const page = e.page;
    const newFilters: IRoleQuickFilter = {
      ...filters,
      page: page.page,
      limit: page.pageSize,
    };
    setFilters(newFilters);
  };
  const handleRowClick = (e: any, data: any) => {
    history.push("/admin/roles/" + data.id);
  };

  return (
    <>
      <Box className={classes.container}>
        <Box className={classes.header}>
          <Box className={classes.headerItem} display="flex" />
          <Box className={classes.headerItem}>
            <Button
              variant="contained"
              color="primary"
              btnType="default"
              startIcon={<AddIcon />}
              style={{ marginLeft: 16 }}
              onClick={() => {
                history.push("/admin/roles/create");
              }}
              size="small"
            >
              {"Thêm vai trò"}
            </Button>
          </Box>
        </Box>
        <Box className={classes.listBox}>
          <Box className={classes.utilities} style={{ minHeight: "auto" }}>
          </Box>
          {loading ? (
            <LoadingAuth />
          ) : (
            <React.Fragment>
              {data.total > 0 ? (
                <>
                  <SapoGrid
                    data={data}
                    page={filters?.page}
                    pageSize={filters?.limit}
                    onPageChange={handlePageChange}
                    stickyHeader
                    tableDrillDown
                    stickyHeaderTop={52}
                    onRowClick={handleRowClick}
                    disablePaging={false}
                  >
                    <GridColumn
                      field="name"
                      title={getRoleQuickFilterLabel(RoleQuickFilterOptions.ROLE)}
                      width={150}
                      align="left"
                    >
                      {({ dataItem }: CellTemplateProps) => {
                        return (
                          <TooltipComponent arrow title={dataItem.name} placement={"top"}>
                            <Typography className={classes.dInline} noWrap>
                              {dataItem.name}
                            </Typography>
                          </TooltipComponent>
                        );
                      }}
                    </GridColumn>
                    <GridColumn
                      field="account_active"
                      title={getRoleQuickFilterLabel(RoleQuickFilterOptions.ACCOUNT_ACTIVE)}
                      width={100}
                      align="right"
                    >
                      {({ dataItem }: CellTemplateProps) => {
                        return <Typography>0</Typography>;
                      }}
                    </GridColumn>
                    <GridColumn
                      field="account_inactive"
                      title={getRoleQuickFilterLabel(RoleQuickFilterOptions.ACCOUNT_INACTIVE)}
                      width={100}
                      align="right"
                    >
                      {({ dataItem }: CellTemplateProps) => {
                        return <Typography>0</Typography>;
                      }}
                    </GridColumn>
                    <GridColumn
                      field="created_on"
                      title={getRoleQuickFilterLabel(RoleQuickFilterOptions.CREATED)}
                      width={70}
                      align="center"
                    >
                      {({ dataItem }: CellTemplateProps) => {
                        return (
                          <>
                            <Typography>
                              {formatDateUTCToLocalDateString(dataItem.created_on, false, "DD/MM/YYYY")}
                            </Typography>
                          </>
                        );
                      }}
                    </GridColumn>
                    <GridColumn
                      field="modified_on"
                      title={getRoleQuickFilterLabel(RoleQuickFilterOptions.MODIFIED_ON)}
                      width={80}
                      align="center"
                    >
                      {({ dataItem }: CellTemplateProps) => {
                        return (
                          <>
                            <Typography>
                              {formatDateUTCToLocalDateString(dataItem.modified_on, false, "DD/MM/YYYY")}
                            </Typography>
                          </>
                        );
                      }}
                    </GridColumn>
                    <GridColumn
                      field="note"
                      title={getRoleQuickFilterLabel(RoleQuickFilterOptions.NOTE)}
                      width={150}
                      align="left"
                    >
                      {({ dataItem }: CellTemplateProps) => {
                        return (
                          <TooltipComponent arrow title={dataItem.note} placement={"top"}>
                            <Typography noWrap className={classes.dInline}>
                              {dataItem.note}
                            </Typography>
                          </TooltipComponent>
                        );
                      }}
                    </GridColumn>
                  </SapoGrid>
                </>
              ) : (
                <NoResultsComponent
                  message={t("_roles:emptyResultFilter")}
                  helpText={t("component:noResults.helpText")}
                />
              )}
            </React.Fragment>
          )}
        </Box>
      </Box>
    </>
  );
};
const mapStateToProps = (state: AppState) => {
  return {
    authState: state.auth,
  };
};
export default connect(mapStateToProps, {})(withStyles(styles)(Role));

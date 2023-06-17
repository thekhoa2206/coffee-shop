import { Box, Typography, withStyles } from "@material-ui/core";
import { AddCircleOutline } from "@material-ui/icons";
import Button from "components/Button";
import LoadingAuth from "components/Loading/LoadingAuth";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import { GridColumn } from "components/SapoGrid/GridColumn/GridColumn";
import SapoGrid from "components/SapoGrid/SapoGrid";
import {
  DataResult,
  GridPageChangeEvent,
} from "components/SapoGrid/SapoGrid.type";
import { CellTemplateProps } from "components/SapoGridSticky";
import SearchBox from "components/SearchBox/SearchBox";
import useQueryParams from "hocs/useQueryParams";
import React, { useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
  IngredientFilterRequest,
  IngredientResponse,
} from "services/IngredientsService";
import { AppState } from "store/store";
import { formatDateUTCToLocalDateString, formatMoney } from "utilities";
import QueryUtils from "utilities/QueryUtils";
import {
  StocktakingReponse,
  StoctakingFilterRequest,
} from "services/StocktakingService/type";
import {
  UserQuickFilterOptions,
  getUserQuickFilterLabel,
} from "./UserFilter.constant";
import Chip from "components/Chip/Chip.component";

import { UserProps } from "./User.types";
import { UserFilterRequest } from "services/UsersService";
import UsersService from "services/UsersService/UsersService";
import styles from "./User.styles";

const User = (props: UserProps & PropsFromRedux) => {
  const { classes, authState} = props;
  const location = useLocation();
  const queryParams = useQueryParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialogIngredient, setOpenDialogIngredient] =
    useState<boolean>(false);
  const [selected, setSelected] = useState<StocktakingReponse>();
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
    const initFilter: UserFilterRequest = {
      page: Number(dataFromQuery["page"]) || 1,
      limit: Number(dataFromQuery["limit"]) || undefined,
      query: dataFromQuery["query"] || undefined,    };
    return initFilter;
  };
  const [filters, setFilters] = useState<StoctakingFilterRequest>({
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
    document.title = "Danh sách nguyên liệu";
  }, []);

  const initData = async (filters: UserFilterRequest) => {
    let res = await UsersService.filter(filters);
    if (res.data)
      setData({
        data:
          res.data.data?.map((user, index) => {
            return {
              stt: index + 1,
              createdBy: user.createdBy,
              createdOn: user.createdOn,
              id: user.id,
              modifiedBy: user.modifiedBy,
              modifiedOn: user.modifiedOn,
              name: user.name,
              status: user.status,
              userName:user.username,
              roleName:user.role,
              passWord:user.passWord,
            };
          }) || [],
        total: res.data.metadata?.total || 0,
      });
    setLoading(false);
  };

  const handlePageChange = (e: GridPageChangeEvent) => {
    setLoading(true);
    const page = e.page;
    const newParams: Record<string, any> = {
      ...Object.fromEntries(queryParams),
      page: page.page,
      limit: page.pageSize,
    };
    setFilters((prev) => ({ ...prev, limit: page.pageSize, page: page.page }));
    changeQueryString(newParams);
  };
  const handleSearch = (value: any) => {
    if (!value || !value?.trim()) {
    }
    const newFilters: IngredientFilterRequest = {
      ...filters,
      page: 1,
      query: value?.trim(),
    };
    setFilters((prev) => ({ ...prev, query: value?.trim() }));
    changeQueryString(newFilters);
  };

  const renderUserStatus = (status?: number) => {
    switch (status) {
      case (1):
        return (
          <Chip
            className="info"
            variant="outlined"
            size="medium"
            label={"Đang làm việc"}
          />
        );
      case (2):
        return (
          <Chip
            className="warning"
            variant="outlined"
            size="medium"
            label={"Nghỉ việc"}
          />
        );
      default:
        return "";
    }
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
                history.push("/admin/users/create");
              }}
            >
              {"Thêm mới nhân viên"}
            </Button>
          </Box>
        </Box>
        <Box className={classes.listBox}>
          <Box className={classes.utilities}>
            <Box className={classes.filterAndSearchBox}>
              <SearchBox
                placeholder={"Tìm kiếm nguyên liệu ..."}
                onSubmit={(e, value) => {
                  handleSearch(value);
                }}
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
                (console.log("66", data),
                (
                  <SapoGrid
                    data={data}
                    page={filters?.page}
                    pageSize={filters?.limit}
                    onPageChange={handlePageChange}
                    stickyHeader
                    tableDrillDown
                    stickyHeaderTop={52}
                    onRowClick={(e, data) => { history.push(`/admin/users/${data.id}/edit`)}}
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
                      title={getUserQuickFilterLabel(
                        UserQuickFilterOptions.CODE
                      )}
                      width={150}
                      align="left"
                    >
                        {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <Typography>
                            {"NV" + dataItem.stt}
                          </Typography>
                        </>
                      );
                    }}
                    </GridColumn>
                    <GridColumn
                      field="name"
                      title={getUserQuickFilterLabel(
                        UserQuickFilterOptions.NAME
                      )}
                      width={150}
                      align="left"
                    />
                                 <GridColumn
                      field="roleName"
                      title={getUserQuickFilterLabel(
                        UserQuickFilterOptions.ROLE
                      )}
                      width={150}
                      align="left"
                    />
                    <GridColumn
                      field="createdOn"
                      title={getUserQuickFilterLabel(
                        UserQuickFilterOptions.CREATED_ON
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
                      field="modifedOn"
                      title={getUserQuickFilterLabel(
                        UserQuickFilterOptions.STATUS
                      )}
                      width={100}
                      align="left"
                    >
                      {({ dataItem }: CellTemplateProps) => {
                        return renderUserStatus(dataItem.status);
                      }}
                    </GridColumn>
                  </SapoGrid>
                ))
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
      {/* <DialogAddIngredient
                open={openDialogIngredient}
                onClose={() => setOpenDialogIngredient(false)}
                ingredient={selected}
                initData={() => {
                    initData(filters);
                }}
            /> */}
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(styles)(User));

import { Box, Typography, withStyles } from "@material-ui/core";
import { AddCircleOutline } from "@material-ui/icons";
import Chip from "components/Chip/Chip.component";
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
  IngredientFilterRequest
} from "services/IngredientsService";
import {
  StocktakingReponse,
  StoctakingFilterRequest,
} from "services/StocktakingService/type";
import { AppState } from "store/store";
import { formatDateUTCToLocalDateString } from "utilities";
import QueryUtils from "utilities/QueryUtils";
import {
  UserQuickFilterOptions,
  getUserQuickFilterLabel,
} from "./Table.constant";
import Paper from '@mui/material/Paper';
import { UserFilterRequest } from "services/UsersService";
import UsersService from "services/UsersService/UsersService";
import styles from "./Table.styles";
import { UserProps } from "./Table.types";
import TableService, { TableFilterRequest } from "services/TableService";
import {Button, Frame, Modal, TextContainer} from '@shopify/polaris';
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
    document.title = "Danh sách bàn";
  }, []);

  const initData = async (filters: TableFilterRequest) => {
    let res = await TableService.filter(filters);
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
              tableId: user.tableId
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
      <Box className={classes.container} style={{height:"100px"}}>
        <Box className={classes.header}>
          <Box className={classes.headerItem} display="flex">
            {""}
          </Box>
          <Box className={classes.headerItem}>
            {/* <Button
            //  variant="primary"
            //   startIcon={<AddCircleOutline />}
            //   onClick={() => {
            //     history.push("/admin/users/create");
            //   }}
            >
              {"Thêm mới nhân viên"}
            </Button> */}
          </Box>
        </Box>
        <Box className={classes.listBox}>
          <Box className={classes.utilities}>
            <Box className={classes.filterAndSearchBox}>
              <SearchBox
                placeholder={"Tìm kiếm thông tin bàn..."}
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
                data.data.map((x)=>(
                  <Paper elevation={3} >
                  <Box>{x.name}</Box> 
                  </Paper>
                  ))
                )
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

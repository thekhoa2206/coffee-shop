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
import React, { useEffect, useState,useCallback } from "react";
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
} from "./EditTable.constant";
import Paper from '@mui/material/Paper';
import { UserFilterRequest } from "services/UsersService";
import UsersService from "services/UsersService/UsersService";
import styles from "./EditTable.styles";
import { UserProps } from "./EditTable.types";
import TableService, { TableFilterRequest } from "services/TableService";
import { Button, Frame, Modal, TextContainer } from '@shopify/polaris';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import {
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Badge,
} from '@shopify/polaris';
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
const EditTable = (props: UserProps & PropsFromRedux) => {
  const { classes, authState } = props;
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
  const [active, setActive] = useState(false);

  const toggleModal =()=> {setActive(!active)};
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
      query: dataFromQuery["query"] || undefined,
    };
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
  const test = ()=>{
    debugger
    SnackbarUtils.success("Đăng nhập thành công!")
  }
  const rowMarkup = data.data.map((x, index) => (
    <IndexTable.Row
      id={x.id}
      key={x.id}
      position={index}
      onClick={test}
    >
      <IndexTable.Cell   >
        <Text variant="bodyMd" fontWeight="bold" as="span" tone="success"  >
          {x.name}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{formatDateUTCToLocalDateString(
        x.createdOn,
        false,
        "DD/MM/YYYY"
      )}</IndexTable.Cell>
      <IndexTable.Cell>{formatDateUTCToLocalDateString(
        x.modifiedOn,
        false,
        "DD/MM/YYYY"
      )}</IndexTable.Cell>

    </IndexTable.Row>
  ),
  );


  // const activator = <Button onClick={toggleModal}>Open</Button>;

  return (
    <>

      <Box className={classes.container} style={{ height: "100px" }}>
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
            <Button variant="primary" tone="success">Thêm bàn</Button>
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
                <IndexTable
                  itemCount={data.data.length}
                  headings={[
                    { title: 'Tên bàn' },
                    { title: 'Ngày tạo' },
                    { title: 'Ngày sửa' },
                  ]}
                  selectable={false}
                >
                  {rowMarkup}
                </IndexTable>
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
            <Frame>
      <div style={{height: '500px'}}>
        <Modal
          open={active}
          onClose={toggleModal}
          title="Discard all unsaved changes"
          primaryAction={{
            destructive: true,
            content: 'Discard changes',
            onAction: toggleModal,
          }}
          secondaryActions={[
            {
              content: 'Continue editing',
              onAction: toggleModal,
            },
          ]}
        >
          <Modal.Section>
            If you discard changes, you’ll delete any edits you made since you
            last saved.
          </Modal.Section>
        </Modal>
      </div>
    </Frame>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(styles)(EditTable));

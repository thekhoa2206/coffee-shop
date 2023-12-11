import { Box, Input, Typography, withStyles } from "@material-ui/core";
import { AddCircleOutline } from "@material-ui/icons";
import Chip from "components/Chip/Chip.component";
import LoadingAuth from "components/Loading/LoadingAuth";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import { GridColumn } from "components/SapoGrid/GridColumn/GridColumn";
import SapoGrid from "components/SapoGrid/SapoGrid";
import TextField from '@mui/material/TextField';
import {
  DataResult,
  GridPageChangeEvent,
} from "components/SapoGrid/SapoGrid.type";
import { CellTemplateProps } from "components/SapoGridSticky";
import SearchBox from "components/SearchBox/SearchBox";
import useQueryParams from "hocs/useQueryParams";
import React, { useEffect, useState, useCallback } from "react";
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
import TableService, { TableFilterRequest, TableRequest } from "services/TableService";
import { Button, Frame, Modal, TextContainer, Toast } from '@shopify/polaris';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import {
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Badge,
} from '@shopify/polaris';
import { getMessageError } from "utilities";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import SuccessButton from "components/SVG/SuccessButtonIcon";

const EditTable = (props: UserProps & PropsFromRedux) => {
  const { classes, authState } = props;
  const location = useLocation();
  const queryParams = useQueryParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialogIngredient, setOpenDialogIngredient] =
    useState<boolean>(false);
  const [table, setTable] = useState<TableRequest | undefined | null>();
  const [data, setData] = useState<DataResult>({
    data: [],
    total: 0,
  });
  const history = useHistory();
  const [active, setActive] = useState(false);
  const [activeAdd, setActiveAdd] = useState(false);
  const toggleModalAdd = () => { setActiveAdd(false) };
  const toggleModal = () => { setActive(!active) };

  const getDefaultQuery = () => {
    // Không hiểu tại sao useQueryParams không dùng đk
    const currentFilter = props.history.location.search as string;
    const dataFromQuery: any = {};
    for (let searchFilter of currentFilter.slice(1).split("&")) {
      const data = searchFilter.split("=");
      dataFromQuery[data[0]] = decodeURIComponent(data[1]);
    }
    const initFilter: TableFilterRequest = {
      page: Number(dataFromQuery["page"]) || 1,
      limit: Number(dataFromQuery["limit"]) || undefined,
      query: dataFromQuery["query"] || undefined,
    };
    return initFilter;
  };
  const [filters, setFilters] = useState<TableFilterRequest>({
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
          res.data.data?.map((x, index) => {
            return {
              stt: index + 1,
              createdBy: x.createdBy,
              createdOn: x.createdOn,
              id: x.id,
              modifiedBy: x.modifiedBy,
              modifiedOn: x.modifiedOn,
              name: x.name,
              status: x.status,
              orderId: x.orderId,
            };
          }) || [],
        total: res.data.metadata?.total || 0,
      });
    setLoading(false);
  };
  const addData = async () => {
    let request: TableRequest = {
      ...table
    }
    if (request.name === null) {
      <Toast content="Tên bàn không được để trống" error onDismiss={toggleModal} />
    }
    try {
      let res = await TableService.create(request);
      if (res.data) {
        SnackbarUtils.success("Tạo bàn thành công");
        initData(filters);
        setActiveAdd(false);
        setTable(null);

      }
    } catch (error) {
      SnackbarUtils.error(getMessageError(error));
    }
    setLoading(false);
  };
  const editData = async () => {
    let request: TableRequest = {
      ...table
    }
    if (request.id === null) {
      <Toast content="Id bàn không được để trống" error onDismiss={toggleModal} />
    }
    try {
      let res = await TableService.update(request, request?.id);
      if (res.data) {
        SnackbarUtils.success("Cập nhập thông tin bàn thành công");
        initData(filters);
        setTable(null);
        setActive(false);
      }
    } catch (error) {
      SnackbarUtils.error(getMessageError(error));
    }
    setLoading(false);
  };

  const delteData = async () => {
    let request: TableRequest = {
      ...table
    }
    if (request.id === null) {
      <Toast content="Id bàn không được để trống" error onDismiss={toggleModal} />
    }
    try {
      let res = await TableService.delete(request?.id);
      if (res.status === 200) {
        SnackbarUtils.success("Cập nhập thông tin bàn thành công");
        initData(filters);
        setTable(null);
        setActive(false);
      }
    } catch (error) {
      SnackbarUtils.error(getMessageError(error));
    }
    setLoading(false);
  };
  const handleSearch = (value: any) => {
    if (!value || !value?.trim()) {
    }
    const newFilters: TableFilterRequest = {
      ...filters,
      page: 1,
      query: value?.trim(),
    };
    setFilters((prev) => ({ ...prev, query: value?.trim() }));
    changeQueryString(newFilters);
  };
  const test = (x: any) => {
    setActive(true);
    setTable({ ...table, name: x.name, id: x.id });
  }



  // const activator = <Button onClick={toggleModal}>Open</Button>;
  const handlePageChange = (e: GridPageChangeEvent) => {
    setLoading(true)
    const page = e.page;
    const newParams: Record<string, any> = {
      ...Object.fromEntries(queryParams),
      page: page.page,
      limit: page.pageSize,
    };
    setFilters((prev) => ({ ...prev, limit: page.pageSize, page: page.page }))
    changeQueryString(newParams);
  };
  return (
    <>

      <Box className={classes.container}>
        <Box className={classes.header}>
          <Box className={classes.headerItem} display="flex">
            {""}
          </Box>
          <Box className={classes.headerItem}>
            <Button variant="primary" tone="success" onClick={() => setActiveAdd(true)}>Thêm bàn</Button>
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
                <>
                  <SapoGrid
                    data={data}
                    page={filters?.page}
                    pageSize={filters?.limit}
                    onPageChange={handlePageChange}
                    stickyHeader
                    tableDrillDown
                    stickyHeaderTop={52}
                    onRowClick={(e, data) => { test(data)}}
                    disablePaging={false}
                  >
                    <GridColumn
                      field="name"
                      title={"Tên bàn"}
                      width={100}
                      align="left"
                    />
                    <GridColumn
                      field="createdOn"
                      title={"Ngày tạo"}
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
                      field="stt"
                      title={"Ngày sửa"}
                      width={80}
                      align="center"
                      >
                      {({ dataItem }: CellTemplateProps) => {
                        return (
                          <>
                            <Typography>
                              {formatDateUTCToLocalDateString(
                                dataItem.modifiedOn,
                                false,
                                "DD/MM/YYYY"
                              )}
                            </Typography>
                          </>
                        );
                      }}
                    </GridColumn>
                  </SapoGrid>
                  {/* <IndexTable
                  itemCount={data.data.length}
                  headings={[
                    { title: 'Tên bàn' },
                    { title: 'Ngày tạo' },
                    { title: 'Ngày sửa' },
                  ]}
                  selectable={false}
    
                >
                  {rowMarkup}
                </IndexTable> */}

                </>
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
      <Frame>
        <div style={{ height: '500px' }}>
          <Modal
            open={active}
            onClose={toggleModal}
            title="Chỉnh sửa thông tin bàn"
            primaryAction={{
              destructive: true,
              content: 'Xoá',
              onAction: delteData,
            }}
            secondaryActions={[
              {
                content: 'Chỉnh sửa',
                onAction: editData,
              },

            ]}
          >
            <Modal.Section>
              <TextField
                id="outlined-basic" label="Tên bàn" variant="outlined"
                fullWidth
                value={table ? table.name : ""}
                onChange={(e: any) => { setTable({ ...table, name: e.target.value }) }} />
            </Modal.Section>
          </Modal>
        </div>
      </Frame>
      <Frame>
        <div style={{ height: '500px' }}>
          <Modal
            open={activeAdd}
            onClose={toggleModalAdd}
            title="Tạo mới bàn"
            secondaryActions={[
              {
                content: 'Tạo bàn',
                onAction: addData,
              },

            ]}

          >
            <Modal.Section>
              <TextField
                id="outlined-basic" label="Tên bàn" variant="outlined"
                fullWidth
                value={table ? table.name : ""}
                onChange={(e: any) => { setTable({ ...table, name: e.target.value }) }} />
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

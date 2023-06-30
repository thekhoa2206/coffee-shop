import { Box, Button, Typography, withStyles } from "@material-ui/core";
import { AddCircleOutline, ContactMailOutlined } from "@material-ui/icons";
import {
  DataResult,
  GridPageChangeEvent,
} from "components/SapoGrid/SapoGrid.type";
import useQueryParams from "hocs/useQueryParams";
import { useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { IngredientFilterRequest } from "services/IngredientsService";
import { ItemFilterRequest } from "services/ItemsService";
import ItemsService from "services/ItemsService/ItemsService";
import { AppState } from "store/store";
import QueryUtils from "utilities/QueryUtils";
import styles from "./Combos.styles";
import { CombosProps } from "./Combos.types";
import React from "react";
import ComboService from "services/ComboService/ComboService";
import { ComboFilterRequest } from "services/ComboService/types";
import SearchBox from "components/SearchBox/SearchBox";
import LoadingAuth from "components/Loading/LoadingAuth";
import SapoGrid from "components/SapoGrid/SapoGrid";
import { GridColumn } from "components/SapoGrid/GridColumn/GridColumn";
import { CellTemplateProps } from "components/SapoGridSticky";
import Image from "components/Image";
import {
  CombosQuickFilterOptions,
  getCombosQuickFilterLabel,
} from "./Combofillter.constant";
import { formatDateUTCToLocalDateString } from "utilities";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import Avatar from "react-avatar";

const Combos = (props: CombosProps & PropsFromRedux) => {
  const { classes, authState } = props;
  const location = useLocation();
  const queryParams = useQueryParams();
  const [loading, setLoading] = useState<boolean>(true);
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
    const initFilter: ItemFilterRequest = {
      page: Number(dataFromQuery["page"]) || 1,
      limit: Number(dataFromQuery["limit"]) || undefined,
      query: dataFromQuery["query"] || undefined,
    };
    return initFilter;
  };
  const [filters, setFilters] = useState<ItemFilterRequest>({
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

  const initData = async (filters: ComboFilterRequest) => {
    let res = await ComboService.filter(filters);
    if (res.data)
      setData({
        data:
          res.data.data?.map((combo, index) => {
            return {
              stt: index + 1,
              createdBy: combo.createdBy,
              createdOn: combo.createdOn,
              id: combo.id,
              modifiedBy: combo.modifiedBy,
              modifiedOn: combo.modifiedOn,
              name: combo.name,
              status: combo.status,
              discount: combo.discountPercentage,
              imageUrl: combo.imageUrl,
              description: combo.description,
              price: combo.price,
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
  return (
    <Box>
      <Box className={classes.header}>
        <Box className={classes.headerItem} display="flex">
          {""}
        </Box>
        <Box></Box>
        <Box className={classes.headerItem}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutline />}
            onClick={() => {
              history.push("/admin/combos/create");
            }}
          >
            {"Thêm combo khác"}
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
              <SapoGrid
                data={data}
                page={filters?.page}
                pageSize={filters?.limit}
                onPageChange={handlePageChange}
                stickyHeader
                tableDrillDown
                stickyHeaderTop={52}
                onRowClick={(e, data) => { history.push(`/admin/combos/${data.id}`) }}
                disablePaging={false}
              >
                <GridColumn
                  field="stt"
                  title={"STT"}
                  width={80}
                  align="center"
                />
                <GridColumn
                  field="image"
                  title={getCombosQuickFilterLabel(
                    CombosQuickFilterOptions.IMAGE_URL
                  )}
                  width={150}
                  align="left"
                >
                  {({ dataItem }: CellTemplateProps) => {
                    return (
                      <>
                        {dataItem.imageUrl ? <Image src={dataItem.imageUrl} style={{ width: "50px", height: "50px" ,borderRadius: "6px"}} /> :
                          <Box style={{ width: "50px", height: "50px", background: "#E8EAEB", borderRadius: "6px" }}>
                            <Avatar size="50" color="#B1AFAF"  round="6px"  name={dataItem.name} maxInitials={2} />
                          </Box>}
                      </>
                    );
                  }}
                </GridColumn>
                <GridColumn
                  field="name"
                  title={getCombosQuickFilterLabel(
                    CombosQuickFilterOptions.NAME
                  )}
                  width={150}
                  align="left"
                />
                <GridColumn
                  field="price"
                  title={getCombosQuickFilterLabel(
                    CombosQuickFilterOptions.PRICE
                  )}
                  width={100}
                  align="left"
                />
                <GridColumn
                  field="description"
                  title={getCombosQuickFilterLabel(
                    CombosQuickFilterOptions.DESCRIPTION
                  )}
                  width={100}
                  align="left"
                />
                <GridColumn
                  field="createdOn"
                  title={getCombosQuickFilterLabel(
                    CombosQuickFilterOptions.CREATED_ON
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
                  title={getCombosQuickFilterLabel(
                    CombosQuickFilterOptions.MODIFIED_ON
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
  );
};
const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(styles)(Combos));

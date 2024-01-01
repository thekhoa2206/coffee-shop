import { makeStyles, Theme } from "@material-ui/core";
import SapoFilter from "components/SapoFilter/SapoFilter";
import useDebounce from "hocs/useDebounce";
import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { IOOrderFilter, OrderFilter, OrderFilterModel } from "services/OrderService";
import { AppState } from "store/store";
import { colorInk } from "theme/palette";
import { formatDateUTC, removeAscent } from "utilities";
import { getOrdersQuickFilterLabel, OrdersQuickFilterOptions } from "../OrderFilter.constant";
import FilterItem from "components/SapoFilter/FilterItemsV2/FilterItem/FilterItem";
import FilterTags from "components/SapoFilter/FilterItemsV2/FilterItems/FilterTags/FilterTags";
import { OrderStatus, PaymentStatus } from "page/Orders/utils/OrderContants";
import { DataSource } from "components/Select/types";
import { DateRangesPredefineType, getNamePredefinedDate } from "utilities/DateRangesPredefine";
import FilterDatePredefined from "components/SapoFilter/FilterItemsV2/FilterItems/FilterDatePredefined/FilterDatePredefined";

interface OrderFilterOtherProps extends PropsFromRedux {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: (filter: IOOrderFilter) => void;
    filters: IOOrderFilter;
    filterModel: OrderFilterModel | null;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    searchBoxFilter: {
        padding: "0 24px",
        marginBottom: 3.75,
        height: 36,
        "& input": {
            height: 36,
            padding: "0 12px",
            color: colorInk.primary,
            "&.Mui-disabled": {
                color: colorInk.base60,
            },
            "&::placeholder": {
                color: colorInk.base40,
                opacity: 1,
            },
        },
    },
}));
const deliveryCollationsFilterDefault = Object.entries(OrdersQuickFilterOptions);
const OrderFilterOther = (props: OrderFilterOtherProps) => {
    const {
        open,
        filterModel,
        filters,
        setOpen,
        onSubmit,
    } = props;
    const [_filterModel, _setFilterModel] = useState<OrderFilterModel | null>(filterModel);
    const [_filters, _setFilters] = useState<IOOrderFilter>(new OrderFilter());
    const [listDeliveryCollationFilter, setListDeliveryCollationFilter] = useState(deliveryCollationsFilterDefault);
    const [listDeliveryCollationFilterTemp, setListDeliveryCollationFilterTemp] = useState(
        deliveryCollationsFilterDefault
    );
    const [loading, setLoading] = useState(false);
    const classes = useStyles();
    const [enableSortMode, setEnableSortMode] = useState(false);
    const [searchFilter, setSearchFilter] = useState("");
    const debounceSearchFilter = useDebounce(searchFilter, 300);
    useEffect(() => {
        _setFilters({
            query: filters.query,
            limit: filters.limit,
            ids: filters.ids,
            statuses: filters.statuses,
            paymentStatus: filters.paymentStatus, 
            createdOnMax: filters.createdOnMax,
            createdOnMin: filters.createdOnMin,
            createdOnPredefined: filters.createdOnPredefined,
            modifiedOnMax: filters.modifiedOnMax,
            modifiedOnMin: filters.modifiedOnMin,
            modifiedOnPredefined: filters.modifiedOnPredefined,
        });
    }, [filters, open]);


    const handleDeleteAllFilter = () => {
        _setFilters(new OrderFilter());
        _setFilterModel(null);
    };

    useEffect(() => {
        _setFilterModel(filterModel);
    }, [filterModel, open]);
    useEffect(() => {
        if (!open) {
            setListDeliveryCollationFilterTemp(listDeliveryCollationFilter);
            setSearchFilter("");
            setEnableSortMode(false);
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            let result = listDeliveryCollationFilter.filter((item, index) =>
                removeAscent(getOrdersQuickFilterLabel(item[1])).includes(removeAscent(debounceSearchFilter))
            );
            setListDeliveryCollationFilterTemp(result);
        }
    }, [debounceSearchFilter]);



    return (
        <SapoFilter
            open={open}
            onClose={() => setOpen(false)}
            onSubmit={() => onSubmit(_filters)}
            onDelete={handleDeleteAllFilter}
            loading={loading}
            handleSaveSortFilter={() => { }}
            handleClickButtonToggleSortMode={() => {
                setEnableSortMode(!enableSortMode);
                setListDeliveryCollationFilterTemp(listDeliveryCollationFilter);
                setSearchFilter("");
            }}
            onCancelSortFilter={() => {
                setEnableSortMode(false);
                setListDeliveryCollationFilterTemp(listDeliveryCollationFilter);
            }}
            enableSortMode={enableSortMode}
        >
            <FilterItem>
                <FilterTags
                    getOptionLabel={(option) => option.label || ""}
                    PopperSuggestItemProps={{
                        optionSelectAll: true,
                        fetchDataSource: async (filter: any) => {
                            let limit = 10;
                            let page = filter.page;
                            let options = [
                                {
                                    value: OrderStatus.IN_PROGRESS,
                                    label: OrderStatus.getName(OrderStatus.IN_PROGRESS),
                                },
                                {
                                    value: OrderStatus.COMPLETED,
                                    label: OrderStatus.getName(OrderStatus.COMPLETED),
                                },
                                {
                                    value: OrderStatus.DELETED,
                                    label: OrderStatus.getName(OrderStatus.DELETED),
                                },
                            ];
                            let _options = options.filter((item) =>
                                removeAscent(`${item.label}`).includes(removeAscent(filter.query))
                            );
                            options = _options.slice((page - 1) * limit, page * limit);
                            let dataSource = {} as DataSource;
                            dataSource.data = options;
                            dataSource.metaData = {
                                totalPage: Math.ceil(_options.length / limit),
                                totalItems: _options.length,
                            };
                            return Promise.resolve(dataSource);
                        },
                    }}
                    onChange={(_value) => {
                        _setFilterModel((__filterModel) => ({ ...__filterModel, statuses: _value }));
                        _setFilters((__filters) => ({
                            ...__filters,
                            statuses: _value.map((item: any) => item.value).join(","),
                        }));
                    }}
                    uniqKey="value"
                    value={_filterModel?.statuses}
                    placeholder={"Chọn trạng thái đơn hàng"}
                    label="Trạng thái đơn hàng"
                />
            </FilterItem>
            <FilterItem>
                <FilterTags
                    getOptionLabel={(option) => option.label || ""}
                    PopperSuggestItemProps={{
                        optionSelectAll: true,
                        fetchDataSource: async (filter: any) => {
                            let limit = 10;
                            let page = filter.page;
                            let options = [
                                {
                                    value: PaymentStatus.PAID,
                                    label: PaymentStatus.getName(PaymentStatus.PAID),
                                },
                                {
                                    value: PaymentStatus.UNPAID,
                                    label: PaymentStatus.getName(PaymentStatus.UNPAID),
                                },
                            ];
                            let _options = options.filter((item) =>
                                removeAscent(`${item.label}`).includes(removeAscent(filter.query))
                            );
                            options = _options.slice((page - 1) * limit, page * limit);
                            let dataSource = {} as DataSource;
                            dataSource.data = options;
                            dataSource.metaData = {
                                totalPage: Math.ceil(_options.length / limit),
                                totalItems: _options.length,
                            };
                            return Promise.resolve(dataSource);
                        },
                    }}
                    onChange={(_value) => {
                        _setFilterModel((__filterModel) => ({ ...__filterModel, paymentStatus: _value }));
                        _setFilters((__filters) => ({
                            ...__filters,
                            paymentStatus: _value.map((item: any) => item.value).join(","),
                        }));
                    }}
                    uniqKey="value"
                    value={_filterModel?.paymentStatus}
                    placeholder={"Chọn trạng thái thanh toán"}
                    label="Trạng thái đơn hàng"
                />
            </FilterItem>
            <FilterItem>
                <FilterDatePredefined
                    label={"Ngày tạo phiếu"}
                    placeholder={"Chọn ngày tạo"}
                    ranges={[
                        {
                            key: DateRangesPredefineType.TODAY,
                            label: getNamePredefinedDate(DateRangesPredefineType.TODAY),
                        },
                        {
                            key: DateRangesPredefineType.YESTERDAY,
                            label: getNamePredefinedDate(DateRangesPredefineType.YESTERDAY),
                        },
                        {
                            key: DateRangesPredefineType.THIS_WEEK,
                            label: getNamePredefinedDate(DateRangesPredefineType.THIS_WEEK),
                        },
                        {
                            key: DateRangesPredefineType.LAST_WEEK,
                            label: getNamePredefinedDate(DateRangesPredefineType.LAST_WEEK),
                        },
                        {
                            key: DateRangesPredefineType.THIS_MONTH,
                            label: getNamePredefinedDate(DateRangesPredefineType.THIS_MONTH),
                        },
                        {
                            key: DateRangesPredefineType.LAST_MONTH,
                            label: getNamePredefinedDate(DateRangesPredefineType.LAST_MONTH),
                        },
                    ]}
                    endDate={_filterModel?.createdOnMax}
                    startDate={_filterModel?.createdOnMin}
                    predefinedDate={_filterModel?.createdOnPredefined}
                    onSubmit={(predefinedDate, dateRanges) => {
                        let _startDate: any = null;
                        let _endDate: any = null;
                        let _predefinedDate = "";
                        if (predefinedDate) {
                            _predefinedDate = predefinedDate;
                        } else if (dateRanges) {
                            _startDate = dateRanges.startDate;
                            _endDate = dateRanges.endDate;
                        }
                        _setFilters((prev) => ({
                            ...prev,
                            createdOnMin: _startDate ? formatDateUTC(_startDate, false) : undefined,
                            createdOnMax: _endDate ? formatDateUTC(_endDate, true) : undefined,
                            createdOnPredefined: _predefinedDate || undefined,
                        }));
                        _setFilterModel((prev) => ({
                            ...prev,
                            createdOnMin: dateRanges?.startDate,
                            createdOnMax: dateRanges?.endDate,
                            createdOnPredefined: _predefinedDate || undefined,
                        }));
                    }}
                />
            </FilterItem>
            <FilterItem>
                <FilterDatePredefined
                    label={"Ngày sửa phiếu"}
                    placeholder={"Chọn ngày sửa"}
                    ranges={[
                        {
                            key: DateRangesPredefineType.TODAY,
                            label: getNamePredefinedDate(DateRangesPredefineType.TODAY),
                        },
                        {
                            key: DateRangesPredefineType.YESTERDAY,
                            label: getNamePredefinedDate(DateRangesPredefineType.YESTERDAY),
                        },
                        {
                            key: DateRangesPredefineType.THIS_WEEK,
                            label: getNamePredefinedDate(DateRangesPredefineType.THIS_WEEK),
                        },
                        {
                            key: DateRangesPredefineType.LAST_WEEK,
                            label: getNamePredefinedDate(DateRangesPredefineType.LAST_WEEK),
                        },
                        {
                            key: DateRangesPredefineType.THIS_MONTH,
                            label: getNamePredefinedDate(DateRangesPredefineType.THIS_MONTH),
                        },
                        {
                            key: DateRangesPredefineType.LAST_MONTH,
                            label: getNamePredefinedDate(DateRangesPredefineType.LAST_MONTH),
                        },
                    ]}
                    endDate={_filterModel?.modifiedOnMax}
                    startDate={_filterModel?.modifiedOnMin}
                    predefinedDate={_filterModel?.modifiedOnPredefined}
                    onSubmit={(predefinedDate, dateRanges) => {
                        let _startDate: any = null;
                        let _endDate: any = null;
                        let _predefinedDate = "";
                        if (predefinedDate) {
                            _predefinedDate = predefinedDate;
                        } else if (dateRanges) {
                            _startDate = dateRanges.startDate;
                            _endDate = dateRanges.endDate;
                        }
                        _setFilters((prev) => ({
                            ...prev,
                            modifiedOnMin: _startDate ? formatDateUTC(_startDate, false) : undefined,
                            modifiedOnMax: _endDate ? formatDateUTC(_endDate, true) : undefined,
                            modifiedOnPredefined: _predefinedDate || undefined,
                        }));
                        _setFilterModel((prev) => ({
                            ...prev,
                            modifiedOnMin: dateRanges?.startDate,
                            modifiedOnMax: dateRanges?.endDate,
                            modifiedOnPredefined: _predefinedDate || undefined,
                        }));
                    }}
                />
            </FilterItem>
        </SapoFilter>
    );
};
const mapStateToProps = (state: AppState) => ({
});
const mapDispatchToProps = {
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(React.memo(OrderFilterOther));

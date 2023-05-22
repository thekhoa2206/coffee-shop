import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  OrderQuickFilterOptions,
  OrderStatus,
  getOrderQuickFilterLabel,
  getOrderStatusName,
} from "./OrdersQuickFilter.consant";
import { filter, isArray } from "lodash";
import QuickFilter from "components/QuickFilter/QuickFilter";
import QuickFilterFixed from "components/QuickFilterFixed/QuickFilterFixed";
import QuickFilterDatePredefined from "components/QuickFilterFixed/QuickFilterDatePredefined/QuickFilterDatePredefined";
import { DateRangesPredefineType, getNamePredefinedDate } from "utilities/DateRangesPredefine";
import { formatDateUTC } from "utilities";
import { OrdersFilterRequest } from "services/OrdersService";

interface OrderQuickFilterProps {
  filters: OrdersFilterRequest;
  onSubmit: (newFilter: OrdersFilterRequest) => void;
}

const OrderQuickFilter = (props: OrderQuickFilterProps) => {
  const {filters, onSubmit } = props;
  const [createdOnMax, setCreatedOnMax] = useState<Date | undefined>();
  const [createdOnMin, setCreatedOnMin] = useState<Date | undefined>();
  const optionStatusOrder = () => {
    const result = [
      { value: OrderStatus.DRAFT, label: getOrderStatusName(OrderStatus.DRAFT) },
      { value: OrderStatus.READY_TO_PICK, label: getOrderStatusName(OrderStatus.READY_TO_PICK) },
      { value: OrderStatus.PICKING, label: getOrderStatusName(OrderStatus.PICKING) },
      { value: OrderStatus.PICKING_FAILED, label: getOrderStatusName(OrderStatus.PICKING_FAILED) },
      { value: OrderStatus.DELIVERING, label: getOrderStatusName(OrderStatus.DELIVERING) },
      { value: OrderStatus.CANCEL, label: getOrderStatusName(OrderStatus.CANCEL) },
      { value: OrderStatus.FINISH, label: getOrderStatusName(OrderStatus.FINISH) },
      { value: OrderStatus.DELIVERING_FAILED, label: getOrderStatusName(OrderStatus.DELIVERING_FAILED) },
    ];
    return result;
  }
  useEffect(() => {
    setCreatedOnMax(filters.created_on_max ? moment(filters.created_on_max).toDate() : undefined);
    setCreatedOnMin(filters.created_on_min ? moment(filters.created_on_min).toDate() : undefined);
  }, [filters]);

  return (
    <QuickFilter>
      <QuickFilterDatePredefined
        label={getOrderQuickFilterLabel(OrderQuickFilterOptions.CREATED_ON)}
        endDate={createdOnMax}
        startDate={createdOnMin}
        predefinedDate={filters?.created_on_predefined}
        ranges={[
          {
            key: DateRangesPredefineType.YESTERDAY,
            label: getNamePredefinedDate(DateRangesPredefineType.YESTERDAY),
          },
          {
            key: DateRangesPredefineType.TODAY,
            label: getNamePredefinedDate(DateRangesPredefineType.TODAY),
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
          let newFilters = {
            ...filters,
            page: 1,
            created_on_min: formatDateUTC(_startDate, false) || undefined,
            created_on_max: formatDateUTC(_endDate, true) || undefined,
            created_on_predefined: _predefinedDate || undefined,
          };
          onSubmit(newFilters);
        }}
      />
      <QuickFilterFixed
        widthPopper={200}
        options={optionStatusOrder()}
        label={getOrderQuickFilterLabel(OrderQuickFilterOptions.STATUS)}
        getOptionLabel={(item) => item.label as string}
        value={filters?.status?.split(",").map((sl) => {
          return { value: sl, label: getOrderStatusName(sl) };
        })}
        uniqKey="value"
        handleSubmit={(value) => {
          if (value && isArray(value)) {
            let status = value.map((item: any) => item.value).join(",");
            let newFilters: OrdersFilterRequest = { ...filters, status: status };
            onSubmit(newFilters);
          }
        }}
      />
    </QuickFilter>
  );
};

export default OrderQuickFilter;

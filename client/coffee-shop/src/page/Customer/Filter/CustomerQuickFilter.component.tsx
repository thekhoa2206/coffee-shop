import React, { useEffect, useState } from "react";
import moment from "moment";
import QuickFilter from "components/QuickFilter/QuickFilter";
import QuickFilterDatePredefined from "components/QuickFilterFixed/QuickFilterDatePredefined/QuickFilterDatePredefined";
import { DateRangesPredefineType, getNamePredefinedDate } from "utilities/DateRangesPredefine";
import { formatDateUTC } from "utilities";
import { CustomerQuickFilterOptions, getCustomerQuickFilterLabel } from "./CustomerFilter.constant";
import { CustomerFilterRequest } from "../Customer.types";

interface CustomerQuickFilterProps {
  filters: CustomerFilterRequest;
  onSubmit: (newFilter: CustomerFilterRequest) => void;
}

const CustomerQuickFilter = (props: CustomerQuickFilterProps) => {
  const {filters, onSubmit } = props;
  const [createdOnMax, setCreatedOnMax] = useState<Date | undefined>();
  const [createdOnMin, setCreatedOnMin] = useState<Date | undefined>();

  useEffect(() => {
    setCreatedOnMax(filters.created_on_max ? moment(filters.created_on_max).toDate() : undefined);
    setCreatedOnMin(filters.created_on_min ? moment(filters.created_on_min).toDate() : undefined);
  }, [filters]);

  return (
    <QuickFilter>
      <QuickFilterDatePredefined
        label={getCustomerQuickFilterLabel(CustomerQuickFilterOptions.CREATED_ON)}
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
    </QuickFilter>
  );
};

export default CustomerQuickFilter;

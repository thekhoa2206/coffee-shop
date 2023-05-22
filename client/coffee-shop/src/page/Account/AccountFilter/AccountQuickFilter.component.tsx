import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  AccountQuickFilterOptions,
  AccountStatus,
  getAccountQuickFilterLabel,
  getAccountStatusName,
} from "./AccountQuickFilter.consant";
import { filter, isArray } from "lodash";
import QuickFilter from "components/QuickFilter/QuickFilter";
import QuickFilterFixed from "components/QuickFilterFixed/QuickFilterFixed";
import QuickFilterDatePredefined from "components/QuickFilterFixed/QuickFilterDatePredefined/QuickFilterDatePredefined";
import { DateRangesPredefineType, getNamePredefinedDate } from "utilities/DateRangesPredefine";
import { formatDateUTC } from "utilities";
import { AccountFilterModel, AccountFilterRequest } from "services/types";

interface AccountQuickFilterProps {
  filters: AccountFilterRequest;
  onSubmit: (newFilter: AccountFilterRequest) => void;
}

const AccountQuickFilter = (props: AccountQuickFilterProps) => {
  const {filters, onSubmit } = props;
  const [createdOnMax, setCreatedOnMax] = useState<Date | undefined>();
  const [createdOnMin, setCreatedOnMin] = useState<Date | undefined>();
  const optionStatusAccount = () => {
    const result = [
      { value: AccountStatus.ACTIVE, label: getAccountStatusName(AccountStatus.ACTIVE) },
      { value: AccountStatus.INACTIVE, label: getAccountStatusName(AccountStatus.INACTIVE) },
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
        label={getAccountQuickFilterLabel(AccountQuickFilterOptions.CREATED)}
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
        options={optionStatusAccount()}
        label={getAccountQuickFilterLabel(AccountQuickFilterOptions.STATUS)}
        getOptionLabel={(item) => item.label as string}
        value={filters?.status?.split(",").map((sl) => {
          return { value: sl, label: getAccountStatusName(sl) };
        })}
        uniqKey="value"
        handleSubmit={(value) => {
          if (value && isArray(value)) {
            let status = value.map((item: any) => item.value).join(",");
            let newFilters: AccountFilterRequest = { ...filters, status: status };
            onSubmit(newFilters);
          }
        }}
      />
    </QuickFilter>
  );
};

export default AccountQuickFilter;

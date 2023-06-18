
import { TagFilterItemType } from "components/TagFilterItem/TagFilterItem.types";
import i18next from "i18next";
import { toNumber } from "lodash";
import { OrderStatus, PaymentStatus } from "page/Orders/utils/OrderContants";
import { IOOrderFilter, OrderFilterModel } from "services/OrderService";
import { camelToSnakeCase, convertDateUTCToLocalDate, formatDateUTC, formatDateUTCToLocalDateString } from "utilities";
import { getNameAndDatePredefined } from "utilities/DateRangesPredefine";
import { OrdersQuickFilterOptions, getOrdersQuickFilterLabel } from "../OrderFilter.constant";

const t = i18next.getFixedT(null, ["customer", "error", "component", "utilities", "order", "common"]);

export class OrderFilterHelpers {
  static async fetchDataFilterItems(
    filters: IOOrderFilter,
  ) {
    const filterModel = {} as OrderFilterModel;
    const tagsFilterItem: TagFilterItemType[] = [];
    //created_on_predefined
    if (!filters.createdOnPredefined) {
      if (filters.createdOnMax) filterModel.createdOnMax = convertDateUTCToLocalDate(filters.createdOnMax, true);
      if (filters.createdOnMin) filterModel.createdOnMin = convertDateUTCToLocalDate(filters.createdOnMin, false);
      if (filters.createdOnMax || filters.createdOnMin) {
        let label = `Từ ${
          filters.createdOnMin
            ? formatDateUTCToLocalDateString(filters.createdOnMin, false)
            : `Trước`
        } Đến ${
          filters.createdOnMax
            ? formatDateUTCToLocalDateString(filters.createdOnMax, true)
            : `nay`
        }`;
        tagsFilterItem.push({
          filterType: "createdOnMax,createdOnMin",
          filterName: OrdersQuickFilterOptions.CREATED_ON,
          label: `${getOrdersQuickFilterLabel(OrdersQuickFilterOptions.CREATED_ON)}: ${label}`,
        });
      }
    } else {
      filterModel.createdOnPredefined = filters.createdOnPredefined;
      tagsFilterItem.push({
        filterType: "createdOnMax,createdOnMin,createdOnPredefined",
        filterName: OrdersQuickFilterOptions.CREATED_ON,
        label: `${getOrdersQuickFilterLabel(
            OrdersQuickFilterOptions.CREATED_ON
        )}: ${getNameAndDatePredefined(filters.createdOnPredefined)}`,
      });
    }
   
    //modified_on_predefined
    if (!filters.modifiedOnPredefined) {
      if (filters.modifiedOnMax)
        filterModel.modifiedOnMax = convertDateUTCToLocalDate(filters.modifiedOnMax, true);
      if (filters.modifiedOnMin)
        filterModel.modifiedOnMin = convertDateUTCToLocalDate(filters.modifiedOnMin, false);
      if (filters.modifiedOnMax || filters.modifiedOnMin) {
        let label = `Từ ${
          filters.modifiedOnMin
            ? formatDateUTCToLocalDateString(filters.modifiedOnMin, false)
            : `Trước`
        } đến ${
          filters.modifiedOnMax
            ? formatDateUTCToLocalDateString(filters.modifiedOnMax, true)
            : `nay`
        }`;
        tagsFilterItem.push({
          filterType: "modifiedOnMax,modifiedOnMin",
          filterName: OrdersQuickFilterOptions.MODIFIED_ON,
          label: `${getOrdersQuickFilterLabel(OrdersQuickFilterOptions.MODIFIED_ON)}: ${label}`,
        });
      }
    } else {
      filterModel.modifiedOnPredefined = filters.modifiedOnPredefined;
      tagsFilterItem.push({
        filterType: "modifiedOnMax,modifiedOnMin,modifiedOnPredefined",
        filterName: OrdersQuickFilterOptions.MODIFIED_ON,
        label: `${getOrdersQuickFilterLabel(
            OrdersQuickFilterOptions.MODIFIED_ON
        )}: ${getNameAndDatePredefined(filters.modifiedOnPredefined)}`,
      });
    }
    if (filters.statuses) {
      let statuses = filters.statuses.split(",");
      filterModel.statuses = statuses.map((item) => toNumber(item)).map((item) => ({
        value: item,
        label: OrderStatus.getName(item),
      }));
      let label = statuses.map((item) => OrderStatus.getName(toNumber(item))).join(", ");
      tagsFilterItem.push({
        filterType: "statuses",
        label: `${getOrdersQuickFilterLabel(OrdersQuickFilterOptions.STATUS)}: ${label}`,
        filterName: OrdersQuickFilterOptions.STATUS,
      });
    }
    if (filters.paymentStatus) {
      let statuses = filters.paymentStatus.split(",");
      filterModel.paymentStatus = statuses.map((item) => toNumber(item)).map((item) => ({
        value: item,
        label: PaymentStatus.getName(item),
      }));
      let label = statuses.map((item) => PaymentStatus.getName(toNumber(item))).join(", ");
      tagsFilterItem.push({
        filterType: "paymentStatus",
        label: `${getOrdersQuickFilterLabel(OrdersQuickFilterOptions.PAYMENT_STATUS)}: ${label}`,
        filterName: OrdersQuickFilterOptions.PAYMENT_STATUS,
      });
    }
    return { filterModel, tagsFilterItem };
  }

  static mapOldSavedSearchModel(jsonContent: string) {
    let regexDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/; // dd/mm/yyyy
    if (jsonContent) {
      let _filters = JSON.parse(jsonContent);
      return {
        created_on_min:
          (regexDate.test(_filters.created_on_min)
            ? formatDateUTC(_filters.created_on_min, false)
            : _filters?.created_on_min) ?? undefined,
        created_on_max:
          (regexDate.test(_filters.created_on_max)
            ? formatDateUTC(_filters.created_on_max, true)
            : _filters?.created_on_max) ?? undefined,
        created_on_predefined: camelToSnakeCase(_filters.created_on_predefined || "") || undefined,
        modified_on_min:
          (regexDate.test(_filters.modified_on_min)
            ? formatDateUTC(_filters.modified_on_min, false)
            : _filters?.modified_on_min) ?? undefined,
        modified_on_max:
          (regexDate.test(_filters.modified_on_max)
            ? formatDateUTC(_filters.modified_on_max, true)
            : _filters?.created_on_max) ?? undefined,
        modified_on_predefined: camelToSnakeCase(_filters.modified_on_predefined || "") || undefined,
        statuses: _filters?.statuses ?? undefined,
        payment_status: _filters?.payment_status ?? undefined,
        query: _filters?.query || "",
      };
    }
    return {};
  }
}

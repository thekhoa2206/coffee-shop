
import SearchSuggestInfinite from "components/Select/SearchSuggestInfinite";
import _ from "lodash";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import AddressService, { CityDistrict } from "services/AddressService";
import StoreService, { CityResponse, DistrictRequestFilter, DistrictResponse } from "services/StoreService";
import { AppState } from "store/store";
import { mapToCityDistricts, removeAscent } from "utilities";
import { Countries } from "utilities/Countries";

interface InputChoiceDistrictProps {
  value: DistrictResponse | null | undefined;
  onChange: (value: DistrictResponse | null | undefined) => void;
  cityId: number | null | undefined;
}

const InputChoiceDistrict = React.forwardRef((props: InputChoiceDistrictProps, ref: any) => {
  const { value, onChange, cityId } = props;
  const { t } = useTranslation(["customer"]);
  const emptyItem: CityDistrict = {
    city_name: t("customer:dialogCustomerAddress.cityName"),
    district_name: t("dialogCustomerAddress.districtName"),
    id: t("customer:dialogCustomerAddress.cityAndDistrictName"),
    district_id: 0,
    city_id: 0,
  };

  return (
    <SearchSuggestInfinite
      type="select-search"
      value={value}
      getOptionLabel={(option) => `${option?.name}`}
      getLabelSelect={() =>
        value ? `${value.name}` : "Chọn Tỉnh/Thành phố - Quận/Huyện"
      }
      placeholder={"Tìm kiếm khu vực"}
      placeholderSelect={"Chọn Tỉnh/Thành phố - Quận/Huyện"}
      onChange={(value) => {
        if (_.isArray(value)) {
          return;
        }
        if (!value?.id) {
          onChange(null);
        } else {
          onChange(value);
        }
      }}
      limit={20}
      fetchDataSource={async(filter: any) => {
        let fil: DistrictRequestFilter ={
          city_id: cityId,
        }
        let res = await StoreService.getDistricts(fil);
        let data = res.data.list_district.district;
        return Promise.resolve({
          data: res.data.list_district.district.splice((filter.page - 1) * filter.limit, filter.limit),
          metaData: {
            totalPage: Math.ceil(data.length / filter.limit),
            totalItems: data.length,
          },
        });
      }}
      width="314px"
      required={true}
      debounce={300}
    />
  );
});

const mapStateToProps = (state: AppState) => ({
  authState: state.auth,
  menuState: state.menu,
});
export default connect(mapStateToProps, {})(InputChoiceDistrict);

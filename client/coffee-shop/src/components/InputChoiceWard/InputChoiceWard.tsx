import SearchSuggest from "components/Filter";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import StoreService, { WardResponse } from "services/StoreService";

interface InputChoiceWardProps {
  ward?: string | null | undefined;
  value: WardResponse | null | undefined;
  onChange: (value: WardResponse | null | undefined) => void;
  districtId: number | null | undefined;
  required?: boolean;
}

const InputChoiceWard = React.forwardRef((props: InputChoiceWardProps, ref: any) => {
  const { value, onChange, districtId, required } = props;
  const { t } = useTranslation(["customer"]);

  const defaultWardModal: WardResponse = {
    id: 0,
    name: `Chọn Phường/Xã`,
    cityId: 0,
    districtId: 0,
    nameTransliteration: "",
    status: ""
  };
  const [options, setOptions] = useState<WardResponse[]>([defaultWardModal]);

  const fetchWards = async (districtId: number) => {
    try {
      const wardsRes = await StoreService.getWards(districtId)
      let wards: WardResponse[] = [defaultWardModal, ...wardsRes.data.list_ward.ward];
      setOptions(wards);
      if (props.ward && !value) {
        const wardModel = wards.find((item) => item.name === props.ward);
        onChange(wardModel);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (!districtId) {
      setOptions([]);
      return;
    }
    fetchWards(districtId);
  }, [districtId]);

  return (
    <SearchSuggest
      uniqKey="id"
      type="select-search"
      options={options}
      value={value}
      getOptionLabel={(option) => option?.name || ""}
      getLabelSelect={() => (value ? value.name : "Chọn Phường/Xã")}
      placeholder={"Tìm kiếm phường xã"}
      placeholderSelect={"Chọn Phường/Xã"}
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
      width="314px"
      debounce={300}
      required={required}
    />
  );
});

export default InputChoiceWard;

import { Address, CityDistrict } from "services/AddressService";

export const genAddress = (address: Address) => {
  let value = "";
  let listValue: string[] = [];
  if (address && address.address1 && address.address1 !== "") {
    listValue.push(address.address1);
  }
  if (address && address.ward && address.ward !== "") {
    listValue.push(address.ward);
  }
  if (address && address.district && address.district !== "") {
    listValue.push(address.district);
  }
  if (address && address.city && address.city !== "") {
    listValue.push(address.city);
  }
  if (listValue && listValue.length > 0) {
    value = listValue.join(", ");
  }
  return value;
};
export function getCityIdByName(name?: string | null, listCityDistrict?: CityDistrict[] | null) {
  if (listCityDistrict && name) {
    let cities = listCityDistrict.filter((city) => city.city_name === name);
    if (cities && cities.length > 0) {
      return cities[0].city_id;
    }
  }
  return 0;
}

export function getDistrictIdByName(
  districtName?: string | null,
  cityName?: string | null,
  listCityDistrict?: CityDistrict[] | null
) {
  if (listCityDistrict && districtName && cityName) {
    let cities = listCityDistrict.filter((city) => city.city_name === cityName && city.district_name === districtName);
    if (cities && cities.length > 0) {
      return cities[0].district_id;
    }
  }
  return 0;
}
export const CityShipping = {
  HANOI: 1,
  HCM: 2,
  HANOI_Name: "Hà Nội",
  HCM_Name: "TP Hồ Chí Minh",
  getCode: (id?: number | null) => {
    switch (id) {
      case CityShipping.HANOI:
        return "HAN";
      case CityShipping.HCM:
        return "SGN";
      default:
        return "";
    }
  },
  getCodeGrabExpress: (id?: number | null) => {
    switch (id) {
      case CityShipping.HANOI:
        return "HNI";
      case CityShipping.HCM:
        return "SGN";
      default:
        return "";
    }
  },
};

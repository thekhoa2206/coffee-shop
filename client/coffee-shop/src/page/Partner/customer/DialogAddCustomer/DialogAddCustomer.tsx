import { Box, Grid, Typography } from "@material-ui/core";
import Dialog from "components/Dialog";
import InputChoiceDistrict from "components/InputChoiceDistrict";
import InputChoiceWard from "components/InputChoiceWard";
import TextField from "components/TextField";
import { isNil } from "lodash";
import { CustomerRequest } from "page/Order/create/CreateOrder.types";
import React, { Fragment, useState } from "react";
import PartnerService from "services/PartnerService";
import {
  DistrictResponse, WardResponse
} from "services/StoreService";
import { getMessageError } from "utilities";
import { REGEX_PHONE_NUMBER_VN } from "utilities/Regex";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { DialogAddCustomerProps } from "./DialogAddCustomer.types";

export const DialogAddCustomer = (props: DialogAddCustomerProps) => {
  const { open, onClose, initData, storeContext } = props;

  const [district, setDistrict] = useState<
    DistrictResponse | null | undefined
  >();
  const [ward, setWard] = useState<WardResponse | null | undefined>();
  const [customer, setcustomer] = useState<CustomerRequest>();

  const handleAddCustomer = () => {
    if (isNil(customer?.name)) {
      SnackbarUtils.error("Tên không được để trống!");
      return;
    }
    if (isNil(customer?.address)) {
      SnackbarUtils.error("Đia chỉ không được để trống!");
      return;
    }
    if (isNil(customer?.phone)) {
      SnackbarUtils.error("SĐT không được để trống!");
      return;
    }
    if (customer?.phone && !REGEX_PHONE_NUMBER_VN.test(customer.phone)) {
      SnackbarUtils.error("SĐT sai định dạng!");
      return;
    }
    if (isNil(customer?.districtId)) {
      SnackbarUtils.error("Quận/Huyện không được để trống!");
      return;
    }
    if (isNil(customer?.wardId)) {
      SnackbarUtils.error("Phường/Xã không được để trống!");
      return;
    }
    let customerAdd: CustomerRequest = {
      ...customer,
      cityId: 1,
      storeId: storeContext?.store?.id,
    };
    if (customer) {
      PartnerService.create(customerAdd)
        .then(async (res) => {
          if (res) {
            onClose();
            if (res.data.CustomerResponse) {
              if (initData) initData(res.data.CustomerResponse);
              SnackbarUtils.success("Tạo mới khách hàng thành công!");
            }
          }
        })
        .catch((err) => {
          SnackbarUtils.error(getMessageError(err));
        });
    }
  };
  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        title={"Thêm mới khách hàng"}
        onOk={handleAddCustomer}
        textOk={"Lưu"}
        minWidthPaper="790px"
        DialogTitleProps={{
          dividerBottom: true
        }}
        children={
          <Box padding="16px">
            <Box>
              <Grid container xs={12} spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    name="code"
                    type="text"
                    label="Mã khách"
                    fullWidth
                    value={customer?.code}
                    onChange={(event: any) => {
                      setcustomer({
                        ...customer,
                        code: event.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="name"
                    type="text"
                    label="Tên khách hàng"
                    required
                    fullWidth
                    value={customer?.name}
                    onChange={(event: any) => {
                      setcustomer({
                        ...customer,
                        name: event.target.value,
                      });
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container xs={12} spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    name="phonenumber"
                    type="text"
                    label="SĐT khách"
                    required
                    fullWidth
                    value={customer?.phone}
                    onChange={(event: any) => {
                      const re = /^[0-9\b]+$/;
                      if (
                        event.target.value === "" ||
                        re.test(event.target.value)
                      ) {
                        setcustomer({
                          ...customer,
                          phone: event.target.value,
                        });
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="address"
                    type="text"
                    label="Địa chỉ"
                    fullWidth
                    value={customer?.address}
                    onChange={(event: any) => {
                      setcustomer({
                        ...customer,
                        address: event.target.value,
                      });
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container xs={12} spacing={2}>
                <Grid item xs={6}>
                  <Typography style={{ marginBottom: "5px" }}>Quận/Huyện</Typography>
                  <InputChoiceDistrict
                    cityId={1}
                    value={district}
                    onChange={(value: DistrictResponse | null | undefined) => {
                      setDistrict(value);
                      setcustomer({
                        ...customer,
                        districtId: value?.id,
                        wardId: 0,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography style={{ marginBottom: "5px" }}>Phường/Xã</Typography>
                  <InputChoiceWard
                    value={ward}
                    districtId={district?.id}
                    onChange={(value: WardResponse | null | undefined) => {
                      setWard(value);
                      setcustomer({
                        ...customer,
                        wardId: value?.id,
                      });
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        }
      />
    </Fragment>
  );
};

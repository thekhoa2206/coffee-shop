import { Box } from "@material-ui/core";
import Dialog from "components/Dialog";
import React, { Fragment, useState } from "react";
import { getMessageError } from "utilities";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { DialogAddCustomerProps } from "./DialogAddCustomer.types";
import { CustomerRequest } from "services/CustomerService";

export const DialogAddCustomer = (props: DialogAddCustomerProps) => {
  const { open, onClose, initData } = props;
  const [customer, setcustomer] = useState<CustomerRequest>();

  const handleAddCustomer = () => {
    // let customerAdd: CustomerRequest = {
    //   ...customer,
    // };
    // if (customer) {
    //   PartnerService.create()
    //     .then(async (res) => {
    //       if (res) {
    //         onClose();
    //         if (res.data.CustomerResponse) {
    //           if (initData) initData(res.data.CustomerResponse);
    //           SnackbarUtils.success("Tạo mới khách hàng thành công!");
    //         }
    //       }
    //     })
    //     .catch((err) => {
    //       SnackbarUtils.error(getMessageError(err));
    //     });
    // }
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
            
          </Box>
        }
      />
    </Fragment>
  );
};

import { Box, Grid, MenuItem, Typography } from "@material-ui/core";
import Dialog from "components/Dialog";
import TextField from "components/TextField";
import React, { Fragment, useState, useEffect } from "react";
import { CustomerRequest } from "services/CustomerService";
import DatePicker from "components/DatePicker/DatePicker.component";
import Select from "components/Select/Index";
import CustomerService from "services/CustomerService/CustomerService";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { getMessageError } from "utilities";
import { DialogAddCustomerProps } from "page/Customer/DialogAddCustomer/DialogAddCustomer.types";

export const DialogAddPartner = (props: DialogAddCustomerProps) => {
  const { open, onClose, initData } = props;
  const [customer, setcustomer] = useState<CustomerRequest>();
  useEffect(() => {
    if(props.customer){
      setcustomer({
        dob: props.customer?.dob,
        name: props.customer.name,
        phoneNumber: props.customer.phoneNumber,
        sex: props.customer.sex,
        type:"partner"
      })
    }
  },[props.customer])
  const handleAddCustomer = () => {
    let customerAdd: CustomerRequest = {
      ...customer,
    };
    if (customer) {
       CustomerService.create(customerAdd)
        .then(async (res) => {
          if (res) {
            onClose();
            if (res.data) {
              if (initData) initData(res.data);
              SnackbarUtils.success("Tạo mới đối tác thành công!");
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
        title={"Thêm mới đối tác"}
        onOk={handleAddCustomer}
        textOk={"Lưu"}
        minWidthPaper="790px"
        textCancel={"Xoá khách hàng"}
        isCancel={true}
        DialogTitleProps={{
          dividerBottom: true
        }}
        children={
          <Box padding={"16px"}>
            <Grid container xs={12} spacing={2}>
              <Grid item xs={6}>
                <TextField 
                label="Tên đối tác" 
                placeholder="Nhập tên đối tác..." 
                fullWidth 
                required 
                value={customer?.name}
                onChange={(e: any) => {setcustomer({...customer, name: e.target.value })}}/>
              </Grid>
              <Grid item xs={6}>
                <TextField 
                label="Số điện thoại" 
                placeholder="Nhập số điện thoại..." 
                fullWidth 
                required 
                value={customer?.phoneNumber}
                onChange={(e: any) => {setcustomer({...customer, phoneNumber: e.target.value })}}/>
              </Grid>
            </Grid>
            {/* <Grid item xs={6}>
                <Select  value={customer?.type} onChange={(value) => {setcustomer({...customer, type: `${value.target.value }`});}} label="Giới tính" placeholder="Chọn giới tính">
                    <MenuItem key="male" value="male">
                      <Typography >khách hàng</Typography>
                    </MenuItem>
                    <MenuItem key="female" value="female">
                      <Typography >Đối tác</Typography>
                    </MenuItem>
                </Select>
              </Grid> */}
          </Box>
        }
      />
    </Fragment>
  );
};

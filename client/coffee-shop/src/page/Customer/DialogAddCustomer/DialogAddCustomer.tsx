import { Box, Grid, MenuItem, Typography } from "@material-ui/core";
import Dialog from "components/Dialog";
import TextField from "components/TextField";
import React, { Fragment, useState, useEffect } from "react";
import { CustomerRequest } from "services/CustomerService";
import { DialogAddCustomerProps } from "./DialogAddCustomer.types";
import DatePicker from "components/DatePicker/DatePicker.component";
import Select from "components/Select/Index";
import CustomerService from "services/CustomerService/CustomerService";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { getMessageError } from "utilities";

export const DialogAddCustomer = (props: DialogAddCustomerProps) => {
  const { open, onClose, initData } = props;
  const [customer, setcustomer] = useState<CustomerRequest>();
  useEffect(() => {
    if(props.customer){
      setcustomer({
        dob: props.customer?.dob,
        name: props.customer.name,
        phoneNumber: props.customer.phoneNumber,
        sex: props.customer.sex,
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
                label="Tên khách hàng" 
                placeholder="Nhập tên khách hàng..." 
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
            <Grid container xs={12} spacing={2}>
              <Grid item xs={6}>
                <DatePicker
                  label="Ngày sinh"
                  lastValue={customer?.dob}
                  onChange={(date) => {
                    if (date)
                      setcustomer({ ...customer, dob: date });
                  }} value={customer?.dob} 
                  
                  textFieldProps={{
                    style: {width: "339px"}
                  }}
                  />
              </Grid>
              <Grid item xs={6}>
                <Select  value={customer?.sex} onChange={(value) => {setcustomer({...customer, sex: `${value.target.value }`});}} label="Giới tính" placeholder="Chọn giới tính">
                    <MenuItem key="male" value="male">
                      <Typography >Nam</Typography>
                    </MenuItem>
                    <MenuItem key="female" value="female">
                      <Typography >Nữ</Typography>
                    </MenuItem>
                    <MenuItem key="other" value="other">
                      <Typography >Khác</Typography>
                    </MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Box>
        }
      />
    </Fragment>
  );
};

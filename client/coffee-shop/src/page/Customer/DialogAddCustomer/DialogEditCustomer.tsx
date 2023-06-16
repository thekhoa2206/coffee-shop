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
import Button from "components/Button";
import { useHistory } from "react-router-dom";

export const DialogEditCustomer = (props: DialogAddCustomerProps) => {
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
  const history = useHistory();
  const handleAddCustomer = () => {
    let customerAdd: CustomerRequest = {
      ...customer,
    };
    if (customer) {

        CustomerService.update(customerAdd, props.customer?.id)
        .then(async (res) => {
          if (res) {
            onClose();
            if (res.data) {
              if (initData) initData(res.data);
              SnackbarUtils.success("Cập nhật khách hàng thành công!");
            }
          }
        })
        .catch((err) => {
          SnackbarUtils.error(getMessageError(err));
        });
       }
  };
  const handleDeleteCustommer = async () =>{
    debugger
    try {
      let res = await CustomerService.delete(props.customer?.id);
      if (res) {
        SnackbarUtils.success("Xoá phiếu nhập kho thành công");
        history.push(`/admin/customers`)
      }
    } catch (error) {
      SnackbarUtils.error(getMessageError(error));
    }
  }
  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        title={"Cập nhập khách hàng"}
        onOk={handleAddCustomer}
        textOk={"Lưu"}
        textCancel={"Xoá khách hàng"}
        minWidthPaper="790px"
        DialogTitleProps={{
          dividerBottom: true
        }}
        DialogActionProps={{
        renderActions: () => (
          <Box display="flex">
            <Button  variant="outlined"    style={{
                            background: "linear-gradient(180deg,#ff4d4d,#ff4d4d)",
                            borderColor: "#ff4d4d",
                            boxShadow: "inset 0 1px 0 0 #ff4d4",
                            color: "#fff",
                            marginRight: "10px",

                          }} onClick={() => handleDeleteCustommer()}>
              Xoá              </Button>
 
            <Button btnType="destruction"  variant="outlined" style={{ marginRight: "10px",}} onClick={() => onClose()}>
              Thoát
            </Button>
            <Button  variant="contained" color="primary"  onClick={() => handleAddCustomer()}>
            Lưu
            </Button>
          </Box>
        ),
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

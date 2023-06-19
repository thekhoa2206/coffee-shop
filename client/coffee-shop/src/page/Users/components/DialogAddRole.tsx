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
import { RoleResquest } from "services/RoleService";
import RoleService from "services/RoleService/RoleService";
import { DialogAddRoleProps } from "./DialogAddRole.types";

export const DialogAddRole = (props: DialogAddRoleProps) => {
  const { open, onClose } = props;
  const [role, setRole] = useState<RoleResquest>();
  const handleAddRole = () => {
    RoleService.create(role)
        .then(async (res) => {
          if (res) {
            onClose();
            if (res.data) {
              SnackbarUtils.success("Tạo mới vai trò thành công!");
            }
          }
        })
        .catch((err) => {
          SnackbarUtils.error(getMessageError(err));
        });

  };
  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        title={"Thêm mới vai trò"}
        onOk={handleAddRole}
        textOk={"Lưu"}
        minWidthPaper="790px"
        isCancel={true}
        DialogTitleProps={{
          dividerBottom: true
        }}
        children={
          <Box padding={"16px"}>
            <Grid container xs={12} spacing={2}>
              <Grid item xs={6}>
                <TextField 
                label="Tên vai trò" 
                placeholder="Nhập tên vai trò..." 
                fullWidth 
                required 
                value={role?.name}
                onChange={(e: any) => {setRole({...role, name: e.target.value })}}/>
              </Grid>
            </Grid>

          </Box>
        }
      />
    </Fragment>
  );
};

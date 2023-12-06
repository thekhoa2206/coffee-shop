import { Box, Grid, Typography } from "@material-ui/core";
import Checkbox from "components/Checkbox/Checkbox.component";
import Dialog from "components/Dialog";
import TextField from "components/TextField";
import React, { Fragment, useState } from "react";
import { RoleResquest } from "services/RoleService";
import RoleService from "services/RoleService/RoleService";
import { getMessageError } from "utilities";
import { RolePermissionGroup, RolePermissions } from "utilities/RoleGroup";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { DialogAddRoleProps } from "./DialogAddRole.types";

export const DialogAddRole = (props: DialogAddRoleProps) => {
  const { open, onClose } = props;
  const [role, setRole] = useState<RoleResquest>();
  const [scopes, setScopes] = useState<string[]>([]);
  const handleAddRole = () => {
    RoleService.create({
      ...role,
      scopes: scopes.join(",")
    })
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
              <Grid item xs={12}>
                <TextField 
                label="Tên vai trò" 
                placeholder="Nhập tên vai trò..." 
                fullWidth 
                required 
                value={role?.name}
                onChange={(e: any) => {setRole({...role, name: e.target.value })}}/>
              </Grid>
              <Grid item xs={12}>
                <Typography>Phân quyền chi tiết</Typography>
                <Box>
                  {RolePermissions.map((role, index) => (
                    <Box  key={index}>
                      <Checkbox checked={!!scopes.find((i) => i === role)} value={role} onChange={(e, checked) => {
                        if(checked){
                          setScopes([...scopes, e.target.value])
                        }else {
                          setScopes([...scopes.filter((i) => i !== role) || []])
                        }
                      }}/>
                      {RolePermissionGroup.getName(role)}
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>

          </Box>
        }
      />
    </Fragment>
  );
};

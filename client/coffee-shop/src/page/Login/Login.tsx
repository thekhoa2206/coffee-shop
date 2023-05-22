import { Box, Typography, withStyles } from "@material-ui/core";
import Button from "components/Button";
import TextField from "components/TextField";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { connect } from "react-redux";
import AccountService from "services/AccountService";
import { MenuState } from "store/Menu/types";
import { AppState } from "store/store";
import { colorGradient, colorInk, colorPaper, colorPink } from "theme/palette";
import {
  getCookie,
  getMessageError,
  setCookie,
  SnackbarErrorProp,
} from "utilities";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import styles from "./Login.styles";
import { LoginProps } from "./Login.types";
import background from "../../images/login.jpg";
import Image from "components/Image";
import Popper from "components/Popper";

export const Login = (props: LoginProps) => {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [cookies, setCookie] = useCookies();
  const handleChangeUsername = (e: any) => {
    setUsername(e.target.value);
  };
  const handleChangePassword = (e: any) => {
    setPassword(e.target.value);
  };
  const handleLogin = async () => {
    try {
      let res = await AccountService.login({
        username: username,
        password: password,
      });
      if (res != null) {
        if (res.data.JwtResponse.token) {
          let jwt = res.data.JwtResponse.token;
          setCookie("jwt", jwt, {
            path: "/",
            expires: new Date(Date.now() + 7200 * 1000),
          });
          window.location.href = `admin/dashboard`;
        }
      }
      SnackbarUtils.success("Đăng nhập thành công!");
    } catch (error) {
      SnackbarUtils.error(getMessageError(error));
    }
  };
  // useEffect(() => {
  //     if (getCookie("jwt") !== ""){
  //         window.location.href = `admin/dashboard`
  //     }
  // })
  return (
    <Box style={{ width: "100%", height: "100%" }}>
      <Image src={background} style={{ width: "100%"}}/>
      <Popper
        onClose={function (
          event: React.MouseEvent<Document, MouseEvent>
        ): void {
          throw new Error("Function not implemented.");
        }}
        style={{marginLeft: "700px", height: "252px", marginTop: "100px"}}
        children={
          <Box
            style={{
              width: 500,
              height: 300,
              margin: "auto",
              border: "1px solid #D3D5D7",
            }}
          >
            <Typography style={{fontSize: 20, fontWeight: 500, marginBottom: 20, marginTop: 20}} align="center">Đăng nhập</Typography>
            <Box>
              <TextField
                size="medium"
                style={{
                  width: 400,
                  background: colorPaper.main,
                  marginLeft: 50,
                }}
                placeholder="Địa chỉ email"
                onChange={(e: any) => handleChangeUsername(e)}
              />
            </Box>
            <Box>
              <TextField
                type="password"
                size="medium"
                style={{
                  width: 400,
                  background: colorPaper.main,
                  marginLeft: 50,
                }}
                placeholder="Mật khẩu"
                onChange={handleChangePassword}
              />
            </Box>
            <Box>
              <Button
                variant="contained"
                color="primary"
                size="large"
                style={{ marginLeft: 180, marginTop: 40 }}
                onClick={handleLogin}
              >
                Đăng nhập
              </Button>
            </Box>
          </Box>
        }
        open={true}
      />
    </Box>
  );
};

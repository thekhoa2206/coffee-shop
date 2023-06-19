import { Box, IconButton, Typography } from "@material-ui/core";
import Button from "components/Button";
import Image from "components/Image";
import Popper from "components/Popper";
import TextField from "components/TextField";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import AccountService from "services/AccountService";
import { colorPaper } from "theme/palette";
import {
  getMessageError
} from "utilities";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import background from "../../images/login.jpg";
import { LoginProps } from "./Login.types";
import EyeIcon from "components/SVG/EyeIcon";
import EyeSlashIcon from "components/SVG/EyeSlashIcon";

export const Login = (props: LoginProps) => {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [isShow, setIsShow] = useState<boolean>(false);
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
        if (res.data.token) {
          let jwt = res.data.token;
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
                type={isShow ?  "text" : "password"}
                size="medium"
                style={{
                  width: 400,
                  background: colorPaper.main,
                  marginLeft: 50,
                }}
                placeholder="Mật khẩu"
                onChange={handleChangePassword}
                InputProps={{
                  endAdornment: <IconButton style={{background: colorPaper.main}} onClick={() => {setIsShow(!isShow)}}>
                    {isShow ? <EyeIcon /> : <EyeSlashIcon/>}
                  </IconButton>,
                }}
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

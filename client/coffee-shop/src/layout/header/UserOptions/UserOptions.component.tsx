import { Link } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { AppState } from "store/store";
import Options from "./components/Options";
import styles from "./UserOptions.styles";
import { UserOptionsProp } from "./UserOptions.types";
import { useTranslation } from "react-i18next";
import UserIcon from "components/SVG/UserIcon";
import LogoutIcon from "components/SVG/LogoutIcon";
import { useCookies } from 'react-cookie';

function UserOptions(props: UserOptionsProp) {
  const { classes, authState } = props;
  const { t } = useTranslation(["dashboard"]);
  const [cookie, setCookie, removeCookie] = useCookies(['jwt']);
  const logOut = () => {
    setCookie("jwt", cookie.jwt, {
      path: "/",
      expires: new Date(),
    })
    window.location.href = '/login';
  };

  return (
    <Fragment>
      <Link className={classes.option} onClick={logOut}>
        <Options svg={<LogoutIcon  />} title={"Đăng xuất"} />
      </Link>
    </Fragment>
  );
}

const mapStateToProps = (state: AppState) => ({
  authState: state.auth,
});
export default connect(mapStateToProps, {})(withStyles(styles)(UserOptions));

import { Box, Hidden } from "@material-ui/core";
import LoadingAuth from "components/Loading/LoadingAuth";
import React, { Suspense } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Switch } from "react-router-dom";
import AuthGuardRoute, { AuthGuardProps } from "shared/auth/auth-guard-route";
import { AppState } from "store/store";
import MAIN_ROUTES from "../../app.routing";
import Header from "../header";
import useStyles from "./MainLayout.style";
import useGenMenuData from "components/Menu/MenuData/MenuData";
import Menu from "components/Menu";
import useWindowSize from "hooks/useWindowSize";

interface MainLayoutProps extends AuthGuardProps, PropsFromRedux {
  match: any;
}

const MainLayoutComponent = (props: MainLayoutProps) => {
  const classes = useStyles();
  const { match, menuState, authState } = props;
  
  useGenMenuData();
  const [width, height] = useWindowSize();
  return !authState.isAuthenticated ? (
    <LoadingAuth />
  ) : (
    <Box className={menuState.collapse ? "collapse" : "expand"} width="100%" height="100%">
      <Menu />
      <Box
        width={menuState.isHidden || width <= 599 ? "100%" : menuState.collapse ? "calc(100% - 52px)" : "calc(100% - 230px)"}
        marginLeft={menuState.isHidden || width <= 599 ? 0 : menuState.collapse ? "52px" : "230px"}
        height="auto"
        bgcolor="#f0f1f1"
        minHeight="100vh"
        className={classes.container}
      >
        <Hidden smUp implementation="js">
          <Box pb="52px"></Box>
        </Hidden>
        <Hidden xsDown implementation="js">
          <Header />
        </Hidden>
        <Suspense
          fallback={
            <Box display="flex" flex="1" flexDirection="column" minHeight="100vh">
              <LoadingAuth />
            </Box>
          }
        >
          <Switch>
            {MAIN_ROUTES().map(({ path, header, authorities, component, redirect, extract, documentTitle }, key) => (
              <AuthGuardRoute
                path={`${match.url}${path}`}
                header={header}
                key={key}
                component={component}
                redirect={redirect}
                exact={extract}
                hasAnyAuthorities={authorities}
                documentTitle={documentTitle}
              />
            ))}
          </Switch>
        </Suspense>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state: AppState) => ({
  authState: state.auth,
  menuState: state.menu,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

  export default connector(MainLayoutComponent);


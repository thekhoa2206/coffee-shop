import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { useEffect, useMemo } from "react";
import { LAYOUT_ROUTES as routes } from "./app.routing";
import AuthGuardRoute from "./shared/auth/auth-guard-route";
import { ThemeProvider, withStyles } from "@material-ui/styles";
import { ModalProvider } from "components/Modal/ModalProvider";
import { AppState } from "store/store";
import { SnackbarProvider } from "notistack";
import { SnackbarUtilsConfigurator } from "utilities/SnackbarUtilsConfigurator";
import { PrintUtilsConfigurator } from "components/PrintiIframe/PrintUtils";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { WithStyles } from "@material-ui/core";
import { updateTheme } from "store/Theme/themeSlice";
import { createTheme } from "theme";
import { Login } from "page/Login/Login";
import { login } from "store/Authenticate/authenticateSlice";
import { getCookie } from "utilities";
import { isNil } from "lodash";
import ChannelPos from "page/ChannelPos/ChannelPos";
const styles = {
  base: {
    "& span": {
      fontSize: 14,
    },
  },
  processBarBaseLine: {
    backgroundColor: "unset",
  },
  processBarRoot: {
    height: 3,
  },
};
const App = (props: PropsFromRedux & WithStyles<typeof styles>) =>  {
  const { authState, classes} = props;
  const dispatch = useDispatch();
  const theme = useMemo(() => createTheme(props.theme.currentTheme), [props.theme.currentTheme]);

  useEffect(() => {
    if ((!authState.isAuthenticated || !authState.user)) {
      dispatch(login());
    }
  }, [authState.isAuthenticated, authState.user]);

  return (
      <ThemeProvider theme={theme}>
      <SnackbarProvider
          maxSnack={1}
          hideIconVariant={true}
          classes={{
            variantSuccess: "snackSuccess",
            variantError: "snackError",
            variantWarning: "snackWarning",
            variantInfo: "snackInfo",
            root: classes.base,
          }}
        >
          <SnackbarUtilsConfigurator />
          <PrintUtilsConfigurator />
          <Router>
            <ModalProvider>
                  <React.Fragment>
                    <Switch>
                      {routes.map(({ path, header, component, redirect, extract, authorities }, key) => (
                        <AuthGuardRoute
                          key={key}
                          path={path}
                          header={header}
                          component={component}
                          redirect={redirect}
                          hasAnyAuthorities={authorities}
                          exact={extract}
                        />
                      ))}
                      <Route path="/login" exact component={Login} />
                    </Switch>
                  </React.Fragment>
            </ModalProvider>
          </Router>
        </SnackbarProvider>
    </ThemeProvider>
  );
}
const mapStateToProps = (state: AppState) => ({
  theme: state.theme,
  authState: state.auth,
});

const mapDispatchToProps = {
  updateTheme,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withStyles(styles)(App));

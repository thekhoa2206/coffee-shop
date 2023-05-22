import moment from "moment";
import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Redirect, Route, RouteProps } from "react-router-dom";
import ErrorBoundary from "shared/errors";
import { updateHeader } from "store/App/applicationSlice";
import { AppState } from "store/store";
import { getCookie } from "utilities";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { HeaderLink } from "../model/routing/route.model";

interface IOwnProps extends RouteProps {
  hasAnyAuthorities?: string[];
  redirect?: string;
  header?: HeaderLink | string | null;
  documentTitle?: string;
}
export interface AuthGuardProps extends IOwnProps, PropsFromRedux { }

export const AuthGuardRoute = (props: AuthGuardProps) => {
  const {
    path,
    component: Component,
    sessionHasBeenFetched,
    isAuthenticated,
    isAuthorized,
    redirect,
    header,
    exact,
    user,
    documentTitle,
    updateHeader,
    ...rest
  } = props;
  useEffect(() => {
    if (exact && isAuthorized) {
      updateHeader(header);
    }
  }, [path]);
  useEffect(() => {
    if (documentTitle) document.title = documentTitle;
  }, [documentTitle]);
  const checkAuthorities = (mergeProps: any) => {
    if(getCookie("jwt") === "" && window.location.pathname !== `/login`){
      window.location.href = `/login`;
    }
    if (!isAuthorized && window.location.pathname !== `/admin/dashbroad`) {
      SnackbarUtils.error("Bạn không có quyền thực hiện chức năng này!")
      window.location.href = `/admin/dashbroad`;
      return;
    }
    return (
      <React.Fragment>
        {redirect ? (
          <Redirect to={redirect.startsWith("/") ? redirect : `${mergeProps.match.url}/${redirect}`} />
        ) : (
          <ErrorBoundary>{Component ? <Component {...mergeProps} /> : <></>}</ErrorBoundary>
        )}
      </React.Fragment>
    );
  };

  const encloseInErrorBoundary = (routeProps: any) => {
    const mergeProps = { ...routeProps, ...rest };
    if (!sessionHasBeenFetched) {
      return <div></div>;
    } else {
      return isAuthenticated ?
        checkAuthorities(mergeProps)
        : (() => {
          // Already redirect in authenticateSlice
          // console.log()
          // if(window.location.href !== `http://localhost:3000/login`)
          //   window.location.href = `/login`;
          return null;
        })();
    }
  };
  if (!Component && !redirect) throw new Error(`A component needs to be specified for path ${(rest as any).path}`);

  return <Route {...rest} render={encloseInErrorBoundary} />;
}

export const hasAnyAuthority = (authorities: string[], hasAnyAuthorities: string[]) => {
  if (authorities && authorities.length !== 0) {
    if (hasAnyAuthorities.length === 0) {
      return true;
    }
    if (authorities.length === 1 && authorities[0] === "ADMIN") {
      return true;
    }
    return hasAnyAuthorities.some((auth) => authorities.includes(auth));
  }
  return false;
};

const mapStateToProps = (
  { auth: { isAuthenticated, user, sessionHasBeenFetched } }: AppState,
  { hasAnyAuthorities = [] }: IOwnProps
) => ({
  isAuthenticated,
  sessionHasBeenFetched: true,
  user: user,
  isAuthorized: user
    ? user.accountOwner
      ? true
      : hasAnyAuthority(user ? user.authorities : [], hasAnyAuthorities)
    : false,
});

const mapDispatchToProps = { updateHeader, };
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(AuthGuardRoute);
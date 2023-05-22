import { AuthGuardProps } from "shared/auth/auth-guard-route";
import React from "react";

interface MainProps extends AuthGuardProps {
  match: any;
}

export default function UILayoutComponent(props: MainProps) {
  return (
    <React.Fragment>
      <div className="ui-components-layout">
        <h1>UI Components layout</h1>
      </div>
    </React.Fragment>
  );
}

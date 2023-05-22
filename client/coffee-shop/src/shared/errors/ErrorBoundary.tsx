import React from "react";
import styles from "./ErrorBoundary.styles";
import i18next from "i18next";
import { WithStyles, withStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";

interface IErrorBoundaryProps extends WithStyles<typeof styles> {
  readonly children: JSX.Element | JSX.Element[];
}

interface IErrorBoundaryState {
  readonly error: any;
  readonly errorInfo: any;
}

class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  readonly state: IErrorBoundaryState = { error: undefined, errorInfo: undefined };
  readonly t = i18next.getFixedT(null, ["common", "error"]);
  readonly classes = this.props.classes;

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    const { error, errorInfo } = this.state;
    if (errorInfo) {
      const errorDetails =
        process.env.REACT_APP_ENV !== "production" ? (
          <details className="preserve-space">
            {error && error.toString()}
            <br />
            {errorInfo.componentStack}
          </details>
        ) : undefined;
      return (
        <Box className={this.classes.root}>
          <Box className={this.classes.container}>
            <Box className={this.classes.backgroundImage}>
              Lỗi
            </Box>
            <h2 className={this.classes.message}>{this.t("error:error.unexpectedError")}</h2>
            {errorDetails}
          </Box>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default withStyles(styles)(ErrorBoundary);

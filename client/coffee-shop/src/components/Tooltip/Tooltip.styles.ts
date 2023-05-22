import { makeStyles, Theme } from "@material-ui/core";
import { isNil } from "lodash";

const useStyles = (props: any) =>
  makeStyles((theme: Theme) => ({
    popper: {
      zIndex: 99999,
    },
    arrow: {
      color: "#fff",
    },
    tooltip: {
      backgroundColor: "#fff",
      fontWeight: 400,
      fontSize: 12,
      color: "#182537",
      borderRadius: 3,
      maxWidth: isNil(props.maxWidth) ? 280 : props.maxWidth,
      boxShadow:
        "0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)",
    },
    tooltipPlacementBottom: {
      margin: "8px 0",
    },
    tooltipPlacementTop: {
      margin: "8px 0",
    },
  }));

export default useStyles;

import { Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      background: "#1A2433",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "46px",
      color: "#fff",
      cursor: "pointer",
      "&:hover": {
        background: "#1A2433",
      },
      position: "relative",
    },
    profileParent: {
      padding: "0 12px",
      height: "100%",
    },
    profileName: {
      padding: "0 10px",
    },
    profilesListMenuItem: {
      borderRadius: "3px",
      overflow: "hidden",
      width: "230px",
      position: "absolute",
      background: "#1A2433",
      bottom: "43px",
      left: 0,
      boxShadow: "0 6px 12px rgb(0 0 0 / 18%)",
      "& > .MuiButtonBase-root": {
        "&:hover": {
          background: "linear-gradient(to right, #2d4563 30%, #2e4663 100%)",
        },
      },
    },
    profilesMenuItem: {
      paddingLeft: "8px",
      paddingRight: "8px",
      "& > svg": {
        with: "13px",
        height: "13px",
        marginRight: "6px",
      },
    },
  });
export default styles;

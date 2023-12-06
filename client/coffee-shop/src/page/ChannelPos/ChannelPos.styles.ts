import { createStyles, Theme } from "@material-ui/core";
import defaultPalette, { colorInk } from "theme/palette";
const styles = (theme: Theme) =>
  createStyles({
    container: {
        
    },
    select: {
      margin: "0 12px",
      height: "24px",
      minWidth: "50px",
      width: "auto",
      "& .MuiSelect-root": {
        padding: "0 25px 0 8px",
        height: "23px",
      },
      "& .MuiSelect-icon": {
        right: "2px",
      },
    }
  });

export default styles;

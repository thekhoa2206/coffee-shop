import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { colorInk } from "theme/palette";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    rootPaper: {
        padding: "16px 24px 0",
        boxShadow: "0px 2px 4px rgba(168, 168, 168, 0.25)",
        height: "100%",
        minHeight: 120,
        paddingBottom: 30,
      },
      content: {
        display: "flex",
        flexDirection: "column",
      },
  })
);
export default useStyles;

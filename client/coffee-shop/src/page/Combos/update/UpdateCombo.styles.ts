import { createStyles, Theme } from "@material-ui/core";
import defaultPalette, { colorInk } from "theme/palette";
const styles = (theme: Theme) =>
    createStyles({
        dragDropFile: {
            cursor: "pointer",
            display: "flex",
          },
        container: {
            width: "1072px",
            margin: "auto",
            marginTop: "32px"
        },
        wrapperBoxInfo: {
            width: "100%",
            boxShadow: "0px 2px 4px rgba(168, 168, 168, 0.25)",
            marginTop: "16px"
        },
        boxContentPaper: {
            padding: "24px 16px",
        },
        inputCategory: {
            marginTop: "16px", width: "293px",
        },
        infiniteList: {
          "&>.InfiniteScroll-BoxCreate": {
            padding: "0 42px",
          },
        },
    });

export default styles;

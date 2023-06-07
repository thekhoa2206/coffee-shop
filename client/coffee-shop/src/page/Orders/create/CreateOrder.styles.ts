import { createStyles, Theme } from "@material-ui/core";
import defaultPalette, { colorInk } from "theme/palette";
const styles = (theme: Theme) =>
    createStyles({
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
            padding: "16px 16px",
            borderTop: "1px solid #E8EAEB"
        },
        inputCategory: {
            marginTop: "16px", width: "293px",
        },
        infiniteList: {
          "&>.InfiniteScroll-BoxCreate": {
            padding: "0 42px",
          },
        },
        customerLineItem: {
            display: "flex",
            margin: 0,
            padding: "10px 24px 10px",
            position: "relative",
            borderRadius: 0,
            "&:after": {
              content: "''",
              position: "absolute",
              backgroundColor: colorInk.base30,
              height: 1,
              bottom: 0,
              left: 24,
              right: 24,
            },
            "&>.icon": {
              fontSize: 32,
              marginRight: 10,
              color: "#4BA7F3",
            },
          },
          listItemRoot: {
            height: 30,
            alignItems: "flex-end",
            padding: "1px 0 1px 16px",
            "& .MuiListItemText-root": {
              margin: 0,
            },
          },
    });

export default styles;

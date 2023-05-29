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
            padding: "24px",
            borderTop: "1px solid #E8EAEB"
        }
    });

export default styles;

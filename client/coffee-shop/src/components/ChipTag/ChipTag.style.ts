import { Theme, createStyles } from "@material-ui/core/styles";
const styles = (theme: Theme) =>
  createStyles({
    root: {
      "& .chip-tag": {
        maxWidth: "100%",
        height: 24,
        margin: "4px 8px 4px 0",
        background: "#E6F4FF",
        fontSize: 14,
        color: "#2B4263",
        "& .MuiSvgIcon-root": {
          color: theme.palette.primary.main,
          width: 18,
          height: 18,
        },
      },
    },
  });
export default styles;

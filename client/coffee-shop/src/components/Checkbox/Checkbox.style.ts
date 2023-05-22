import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: 24,
      height: 24,
      padding: 5,
      marginRight: 4,
    },
    icon: {
      borderRadius: 3,
      width: 14,
      height: 14,
      boxShadow: "inset 0 0 0 1.5px rgba(0, 0, 0, 0.26)",
      backgroundColor: "transparent",
      backgroundImage: "none",
      "input:disabled ~ &": {
        boxShadow: "inset 0 0 0 1.5px rgba(0, 0, 0, 0.26)",
      },
    },
    checkedIcon: {
      boxShadow: "inset 0 0 0 1.5px rgb(0, 136, 255)",
      "&:before": {
        display: "block",
        width: 14,
        height: 14,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 14 14' " +
          "fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.996 7.556L4.7 " +
          "6.285L3.3 7.715L6.004 10.362L10.703 5.711L9.297 4.289L5.996 7.556Z' " +
          "fill='%230088FF'/%3E%3C/svg%3E%0A\")",
        content: '""',
      },
      "input:disabled ~ &": {
        "&:before": {
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
            " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
            "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='rgba(0, 0, 0, 0.26)'/%3E%3C/svg%3E\")",
        },
      },
    },
    indeterminateIcon: {
      boxShadow: "inset 0 0 0 1.5px rgb(0, 136, 255)",
      "&:before": {
        display: "block",
        width: 14,
        height: 14,
        backgroundImage:
          "url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M 14 8 L 14 10 L 4 10 L 4 8 L 14 8 Z' fill='%230088FF'/%3E%3C/svg%3E\")",
        content: '""',
      },
      "input:disabled ~ &": {
        "&:before": {
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
            " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
            "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='rgba(0, 0, 0, 0.26)'/%3E%3C/svg%3E\")",
        },
      },
    },
  });

export default styles;

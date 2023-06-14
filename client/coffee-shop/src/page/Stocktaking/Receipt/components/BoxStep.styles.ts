import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { colorBorder, colorInk, colorRedWarning } from "theme/palette";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    stepper: {
      padding: 0,
      backgroundColor: "transparent",
      "& .MuiStepConnector-root": {
        width: 100,
        left: -50, //width/2
        "&>.MuiStepConnector-line": {
          borderTopWidth: 2,
          borderColor: colorBorder.primary.main,
        },
        "&.MuiStepConnector-active,&.MuiStepConnector-completed": {
          "&>.MuiStepConnector-line": {
            borderColor: theme.palette.primary.main,
          },
        },
      },
      "& .MuiStepIcon-root": {
        fontSize: 20,
        padding: 1,
      },
      "&>.MuiStep-root": {
        "&:first-child": {
          paddingLeft: 0,
          "& .MuiStepLabel-root": {
            "& .MuiStepLabel-labelContainer": {
              marginLeft: 8,
              "&>.MuiStepLabel-label": {
                textAlign: "left",
              },
            },
          },
        },
        "&:last-child": {
          paddingRight: 0,
          "& .MuiStepLabel-root": {
            "& .MuiStepLabel-labelContainer": {
              "&>.MuiStepLabel-label": {
                textAlign: "right",
              },
            },
          },
        },
        width: 118,
        padding: "0 48px",
      },
      "& .MuiStepIcon-text": {
        fontSize: 16,
        fontWeight: 500,
        transform: "translate(0, 1px)",
      },
      "& .MuiStepLabel-label": {
        marginTop: 4,
        lineHeight: "20px",
        padding: 0,
        whiteSpace: "nowrap",
        color: colorInk.primary,
      },
      "&>.MuiStep-root:not(.MuiStep-completed)": {
        "&>.MuiStepLabel-root:not(.Mui-disabled)": {
          "& .MuiStepLabel-iconContainer": {
            height: 28,
            width: 28,
            background: "#E6F4FF",
            padding: 4,
            borderRadius: "50%",
            "&>.MuiStep-root:not(.MuiStep-completed)": {
              "&>.MuiStepLabel-root:not(.Mui-disabled)": {
                "& .MuiStepLabel-iconContainer": {
                  height: 28,
                  width: 28,
                  background: "transparent", //"#E6F4FF"
                  padding: 4,
                  borderRadius: "50%",
                },
              },
            },
          },
        },
      },
      "&>.MuiStep-completed": {
        "& .MuiStepLabel-iconContainer": {
          height: 28,
          width: 28,
          padding: 4,
          borderRadius: "50%",
        },
      },
      "& .MuiStepLabel-root": {
        "&.Mui-disabled": {
          "& .MuiStepLabel-iconContainer": {
            height: 28,
            width: 28,
            padding: 4,
            position: "relative",
            "&:after": {
              content: "''",
              position: "absolute",
              width: 20,
              height: 20,
              top: 4,
              left: 4,
              borderRadius: "50%",
              border: "2px solid",
              borderColor: colorBorder.primary.main,
            },
            "&>.MuiStepIcon-root": {
              fill: "transparent",
              "&>.MuiStepIcon-text": {
                fill: colorBorder.primary.main,
              },
            },
          },
          "& .MuiStepLabel-labelContainer": {
            "&>.MuiStepLabel-label": {
              color: colorInk.base60,
            },
          },
        },
        "& .MuiStepLabel-labelContainer": {
          position: "absolute",
          bottom: -40,
          height: 40,
          left: "50%",
          transform: "translate(-50%, 0)",
          display: "block",
          width: 100,
        },
      },
    },
    stepCancelled: {
      "& .MuiStepConnector-root": {
        "&.MuiStepConnector-active,&.MuiStepConnector-completed": {
          "&>.MuiStepConnector-line": {
            borderColor: colorBorder.primary.main,
          },
        },
      },
      "& .MuiStepLabel-root, & .MuiStepLabel-root.Mui-disabled": {
        "& .MuiStepLabel-iconContainer": {
          "&>.MuiSvgIcon-root": {
            color: colorRedWarning.primary.main,
            fontSize: 20,
          },
          "&:after": {
            borderColor: "transparent",
          },
        },
      },
    },
  })
);
export default useStyles;

import { Box, makeStyles, Theme, Typography } from "@material-ui/core";
import Button from "components/Button";
import React from "react";
import Dialog, { DialogPropsCustom } from "../Dialog";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    "& .iconCloseBtn": {
      top: 6,
    },
  },
}));

const DialogDelete = (
  props: DialogPropsCustom & {
    variant?: "default" | "destruction" | "notice";
  }
) => {
  const { onClose, onOk, DialogActionProps, children, isLoading, variant = "destruction", ...remainProps } = props;
  const { t } = useTranslation(["component"]);
  const classes = useStyles();
  return (
    <Dialog
      maxWidthPaper={585}
      minWidthPaper={585}
      DialogTitleProps={{
        style: {
          marginTop: 6,
        },
      }}
      classRoot={classes.root}
      onOk={onOk}
      showCloseBtnTitle={true}
      onClose={onClose}
      DialogActionProps={{
        renderActions: () => (
          <Box display="flex" justifyContent="flex-end">
            <Box marginRight={2}>
              <Button
                // style={{ width: 64 }}
                variant="outlined"
                size="small"
                color="primary"
                btnType={variant}
                onClick={(e) => onClose && onClose(e, "backdropClick")}
              >
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  {props.textClose || DialogActionProps?.textClose || `${t("component:button.exit")}`}
                </Typography>
              </Button>
            </Box>
            <Box>
              <Button
                // style={{ width: 64 }}
                isLoading={isLoading}
                variant="contained"
                size="small"
                color="primary"
                btnType={variant}
                onClick={() => onOk && onOk()}
              >
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  {props.textOk || DialogActionProps?.textOk || `${t("component:button.delete")}`}
                </Typography>
              </Button>
            </Box>
          </Box>
        ),
        ...DialogActionProps,
      }}
      {...remainProps}
    >
      <Box style={{ fontSize: 14 }}>{children}</Box>
    </Dialog>
  );
};

export default DialogDelete;

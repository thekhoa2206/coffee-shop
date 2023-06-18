import { Box, Dialog, DialogActions, DialogTitle, IconButton, Slide, Typography } from "@material-ui/core";
import Button from "components/Button";
import DialogContent from "components/Dialog/DialogContent";
import { CloseIcon } from "components/SVG";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import useStyles from "./SapoFilter.styles";
import { SapoFilterProps } from "./SapoFilter.types";

function SapoFilter(props: SapoFilterProps) {
  const classes = useStyles();
  const {
    onClose,
    open,
    onSubmit,
    children,
    onDelete,
    classRoot,
    loading,
    enableSortMode,
    handleSaveSortFilter,
    onCancelSortFilter,
    isShowButtonToggleSortMode,
    handleClickButtonToggleSortMode,
  } = props;
  const { t } = useTranslation(["component"]);
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="filter-dialog"
      open={open}
      TransitionComponent={Slide}
      TransitionProps={{ direction: "left", timeout: 400 } as any}
      fullWidth={true}
      maxWidth="sm"
      disableBackdropClick
      disableRestoreFocus
      disableEnforceFocus
      classes={{
        paper: `${classes.dialog} ${classRoot ?? ""}`,
      }}
    >
      <DialogTitle classes={{ root: classes.dialogTitle }} disableTypography>
        <Box display="flex" alignItems="center">
          <Typography className="title">Bộ lọc</Typography>
        </Box>
        <IconButton aria-label="close" onClick={handleClose} classes={{ root: classes.iconButtonClose }}>
          <CloseIcon className={classes.iconClose} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true} dividerBottom={true} className={classes.dialogContent}>
        {children}
      </DialogContent>
      <DialogActions classes={{ root: classes.dialogActions }}>
        {enableSortMode ? (
          <Fragment>
            <Button variant="outlined" onClick={onCancelSortFilter} isLoading={loading}>
              {t("button.cancel")}
            </Button>
            <Button variant="contained" onClick={handleSaveSortFilter} isLoading={loading}>
              {t("button.save")}
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <Button btnType="destruction" color="primary" variant="outlined" onClick={onDelete}>
              Xóa bộ lọc
            </Button>
            <Button variant="contained" color="primary" onClick={onSubmit}>
              Lọc
            </Button>
          </Fragment>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default SapoFilter;

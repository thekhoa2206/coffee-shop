import { Box, Button, DialogContentProps, Typography } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { AxiosResponse } from "axios";
import Dialog from "components/Dialog/Dialog";
import { cloneDeep } from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getMessageError } from "utilities";
import useStyles from "./DialogBulkAction.styles";

interface DialogBulkActionProps<T> extends DialogContentProps {
  title: string;
  //axios funtion
  process: (...param: any) => Promise<AxiosResponse<any>>;
  //Các param mà xios funtion cần (mảng 2 chiều vd: [[param1, param2,...], [param1, param2,...]])
  paramForProcess: any[];
  open: boolean;
  onClose: () => void;
  //validate trước khi xác nhận
  handleValidateBeforeConfirm?: () => boolean;
  //list item selected
  listSelected: T[];
  //key object để hiển thị khi process xong
  keyObjectShowMesssage: keyof T;
  messageSuccess: string;
  onReload?: () => void;
  updateSuccessTitle: string;
  updateFailTitle: string;
  //Truyền đúng pattern để detect link (ví dụ: /admin/customer/{id} - {id} là key nằm trong T)
  linkSuccessTo: string;
}
function DialogBulkAction<T>(props: DialogBulkActionProps<T>) {
  const {
    title,
    children,
    process,
    paramForProcess,
    onClose,
    open,
    handleValidateBeforeConfirm,
    listSelected,
    keyObjectShowMesssage,
    messageSuccess,
    onReload,
    updateFailTitle,
    updateSuccessTitle,
    linkSuccessTo,
  } = props;

  const [listObjectSuccess, setListObjectSuccess] = useState<T[]>([]);
  const [listObjectFaild, setListObjectFaild] = useState<{ object: T; error: string }[]>([]);
  const [processStatus, setProcessStatus] = useState("");
  const classes = useStyles();
  const [showDetailSuccess, setShowDetailSuccess] = useState(false);
  const [showDetailFail, setShowDetailFail] = useState(false);

  const { t } = useTranslation(["customer", "error", "component", "common"]);
  let listSuccess: T[] = [];
  let listFaild: { object: T; error: string }[] = [];
  const handleConfirm = async (index: number) => {
    setProcessStatus("processing");

    await process(...paramForProcess[index])
      .then((data) => {
        listSuccess.push(listSelected[index]);
        setListObjectSuccess(cloneDeep(listSuccess));
      })
      .catch((error) => {
        listFaild.push({ object: listSelected[index], error: getMessageError(error) });
        setListObjectFaild(cloneDeep(listFaild));
      })
      .finally(() => {
        if (index < listSelected.length - 1) {
          handleConfirm(index + 1);
        } else {
          setProcessStatus("complete");
        }
      });
  };

  useEffect(() => {
    if (!open) {
      setListObjectSuccess([]);
      setListObjectFaild([]);
      setProcessStatus("");
      setShowDetailFail(false);
      setShowDetailSuccess(false);
    }
    if (open) {
      //không truyền children gọi thẳng vào process
      if (!children) {
        handleConfirm(0);
      }
    }
  }, [open]);
  return (
    <Fragment>
      <Dialog
        title={title}
        open={open}
        onClose={processStatus !== "" ? undefined : onClose}
        fullWidth
        maxWidthPaper={700}
        textOk="Xác nhận"
        isLoading={processStatus === "processing"}
        onOk={() => {
          if (handleValidateBeforeConfirm && handleValidateBeforeConfirm() === false) return;
          if (processStatus === "complete") {
            onClose();
            if (onReload) onReload();
          } else {
            handleConfirm(0);
          }
        }}
        DialogTitleProps={{
          dividerBottom: processStatus !== "" ? true : false,
        }}
      >
        {processStatus === "" ? (
          children
        ) : (
          <Fragment>
            <Box marginTop={"16px"}>
              <Typography variant="h3">
                {processStatus === "processing"
                  ? t("component:dialogDelete.loadingData")
                  : t("component:dialogDelete.loadSuccess")}
              </Typography>
            </Box>
            <Box marginTop="12px">
              <Typography>
                {updateSuccessTitle}{" "}
                <Typography component="span" color="primary">
                  {listObjectSuccess && listObjectSuccess.length > 0 ? listObjectSuccess.length : "0"}
                </Typography>
                {listObjectSuccess && listObjectSuccess.length > 0 && (
                  <Button
                    onClick={() => {
                      setShowDetailSuccess(!showDetailSuccess);
                    }}
                    endIcon={<ArrowDropDownIcon />}
                    className={classes.btnShowDetai}
                  >
                    {t("common:detail")}
                  </Button>
                )}
              </Typography>
              {listObjectSuccess && listObjectSuccess.length > 0 && showDetailSuccess && (
                <Box boxShadow={2} className={classes.boxDetail}>
                  {listObjectSuccess.map((item, index) => {
                    return (
                      <Box key={index} className={classes.boxDetailItem}>
                        <Typography key={index}>
                          <Link
                            className={classes.link}
                            to={() => {
                              let str = linkSuccessTo.replaceAll("{", "").replaceAll("}", "");
                              const regexp = new RegExp("{(.*?)}", "gm");
                              const array = [...linkSuccessTo.matchAll(regexp)];
                              array.forEach((reg, index) => {
                                if (reg[1]) {
                                  const strItem = reg[1];
                                  str = str.replace(reg[1], `${item[strItem as keyof T]}`);
                                }
                              });
                              return str;
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              let str = linkSuccessTo.replaceAll("{", "").replaceAll("}", "");
                              const regexp = new RegExp("{(.*?)}", "gm");
                              const array = [...linkSuccessTo.matchAll(regexp)];
                              array.forEach((reg, index) => {
                                if (reg[1]) {
                                  const strItem = reg[1];
                                  str = str.replace(reg[1], `${item[strItem as keyof T]}`);
                                }
                              });
                              window.open(str);
                            }}
                          >
                            {item[keyObjectShowMesssage]}
                          </Link>{" "}
                          {messageSuccess}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
            <Box marginTop="8px">
              <Typography>
                {updateFailTitle}{" "}
                <Typography component="span" color="error">
                  {listObjectFaild && listObjectFaild.length > 0 ? listObjectFaild.length : "0"}
                </Typography>
                {listObjectFaild && listObjectFaild.length > 0 && (
                  <Button
                    onClick={() => {
                      setShowDetailFail(!showDetailFail);
                    }}
                    endIcon={<ArrowDropDownIcon />}
                    className={classes.btnShowDetai}
                  >
                    {t("common:detail")}
                  </Button>
                )}
              </Typography>
              {listObjectFaild && listObjectFaild.length > 0 && showDetailFail && (
                <Box boxShadow={2} className={classes.boxDetail}>
                  {listObjectFaild.map((item, index) => {
                    return (
                      <Box key={index} className={classes.boxDetailItem}>
                        <Typography>
                          {item.object && item.object[keyObjectShowMesssage]} - {item.error}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          </Fragment>
        )}
      </Dialog>
    </Fragment>
  );
}

export default DialogBulkAction;

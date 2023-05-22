import { Box, FormControl, MenuItem, Select, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React, { Fragment, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import useStyles from "./SapoPagination.style";
import clsx from "clsx";
import { DEFAULT_PAGESIZE_OPTIONS } from "../SapoGrid.constants";

export interface SapoPagintationProps {
  pageSizeOptions?: number[];
  pageSize: number;
  total: number;
  page: number;
  pageChange: (e: React.SyntheticEvent<HTMLElement>, newPage: number) => void;
  pageSizeChange: (e: React.SyntheticEvent<HTMLElement>, newPageSize: number) => void;
  disablePageSizeChange?: boolean;
  style?: React.CSSProperties;
}

const SapoPagintation = (props: SapoPagintationProps) => {
  const {
    pageSizeOptions = DEFAULT_PAGESIZE_OPTIONS,
    pageSize,
    total,
    page,
    pageChange,
    pageSizeChange,
    disablePageSizeChange,
    style,
  } = props;
  const { t } = useTranslation(["component"]);
  const classes = useStyles();
  const handlePageSizeChange = (e: React.ChangeEvent<any>, child: ReactNode) => {
    pageSizeChange(e, parseInt(e.target.value, 10));
  };

  const handlePageChange = (e: React.ChangeEvent<any>, page: number) => {
    pageChange(e, page);
  };
  return (
    <React.Fragment>
      <Box style={style} className={clsx(classes.root, "sapo-pagination")}>
        {!disablePageSizeChange && (
          <Fragment>
            <Typography>{"Hiển thị"}</Typography>
            <FormControl variant="outlined">
              <Select className={classes.select} value={pageSize} onChange={handlePageSizeChange}>
                {pageSizeOptions.map((pageSizeOption, index) => (
                  <MenuItem key={index} value={pageSizeOption}>
                    <Typography className={classes.pageSizeOption}>{pageSizeOption}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography>{"Kết quả"}</Typography>
          </Fragment>
        )}

        <Typography className={classes.labelDisplayedRows}>
          {`${"Từ"} ${(page - 1) * pageSize + 1} ${"đến"} ${
            page * pageSize < total ? page * pageSize : total
          } ${"trên tổng"} ${total}`}
        </Typography>
        <Pagination
          size="small"
          color="primary"
          count={Math.ceil(total / pageSize)}
          page={page}
          onChange={handlePageChange}
          className={classes.pagingContainer}
        />
      </Box>
    </React.Fragment>
  );
};

export default React.memo(SapoPagintation);

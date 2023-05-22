import { Box, IconButton, Typography } from "@material-ui/core";
import { ArrowLeftIcon, ArrowRightIcon } from "components/SVG";
import React from "react";
import { useTranslation } from "react-i18next";
import useStyles from "./SapoPagination2.style";
export interface SapoPagintation2Props {
  pageSize: number;
  total: number;
  page: number;
  nameObjectSelected?: string;
  pageChange: (e: React.SyntheticEvent<HTMLElement>, newPage: number) => void;
}
const SapoPagintation2 = (props: SapoPagintation2Props) => {
  const { pageSize, total, page, pageChange, nameObjectSelected } = props;
  const classes = useStyles();
  const { t } = useTranslation(["component"]);

  const handlePageChange = (e: React.ChangeEvent<any>, page: number) => {
    pageChange(e, page);
  };
  const checkActivePagingBtn = (page: number): boolean => {
    let totalPage = total ? Math.ceil(total / pageSize) : 0;
    return page > 0 && page <= totalPage;
  };
  return (
    <React.Fragment>
      <Box className={classes.root} style={{position: "-webkit-sticky"}}>
        <Typography>
          {t("component:pagination.total")} {total} {nameObjectSelected}
        </Typography>

        <Box className={classes.paginate}>
          <IconButton
            className="paging-btn prev"
            disabled={!checkActivePagingBtn(page - 1)}
            onClick={(e) => handlePageChange(e, page - 1)}
          >
            <ArrowRightIcon />
          </IconButton>
          <IconButton
            className="paging-btn next"
            disabled={!checkActivePagingBtn(page + 1)}
            onClick={(e) => handlePageChange(e, page + 1)}
          >
            <ArrowLeftIcon />
          </IconButton>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default SapoPagintation2;

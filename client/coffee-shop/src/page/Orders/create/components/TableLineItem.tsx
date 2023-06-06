import { Table, TableBody, TableCell, TableHead } from "@material-ui/core";
import { useOrderStore } from "page/Orders/store/store";
import React, { Fragment } from "react";
export type TableLineItemProps = {

}
export const TableLineItem = (props: TableLineItemProps) => {
  const { } = props;
  const {lineItems} = useOrderStore();
  return (
    <Fragment>
        <Table stickyHeader>
            <TableHead>
                <TableCell>STT</TableCell>
                <TableCell>Tên mặt hàng</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Giá tiền</TableCell>
                <TableCell></TableCell>
            </TableHead>
            <TableBody>
                {lineItems && lineItems.map((item) => (<>
                <TableCell>STT</TableCell>
                <TableCell>Tên mặt hàng</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Giá tiền</TableCell>
                <TableCell></TableCell>
                </>))}
            </TableBody>
        </Table>
    </Fragment>
  );
};

import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
} from "@material-ui/core";
import BoxNoDataComponent from "components/BoxNoData/BoxNoData.component";
import Button from "components/Button";
import InputQuantity from "components/InputQuantity/InputQuantity";
import CloseSmallIcon from "components/SVG/CloseSmallIcon";
import { useOrderStore } from "page/Orders/store/store";
import React, { Fragment } from "react";
import {
  formatMoney
} from "utilities";
export type TableLineItemProps = {};
export const TableLineItem = (props: TableLineItemProps) => {
  const {} = props;
  const { lineItems, updateLineItem, deleteLineItem } = useOrderStore();
  return (
    <Fragment>
      <Table stickyHeader>
        <TableHead>
          <TableCell>STT</TableCell>
          <TableCell>Tên mặt hàng</TableCell>
          <TableCell>Số lượng</TableCell>
          <TableCell>Giá tiền</TableCell>
          <TableCell>Thành tiền</TableCell>
          <TableCell></TableCell>
        </TableHead>
        {lineItems &&
          lineItems.map((item, index) => (
            <TableBody key={item.productId}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <InputQuantity
                  value={item.quantity}
                  onChange={(value: any) => {
                    updateLineItem(
                      { ...item, quantity: value as number },
                      item.productId
                    );
                  }}
                  max={99999999}  
                  autoHidden
                  className="input-price"              
                />
              </TableCell>
              <TableCell>
                <InputQuantity
                  value={item.price}
                  onChange={(value: any) => {
                    updateLineItem(
                      { ...item, price: value },
                      item.productId
                    );
                  } }
                  name={"price"}
                  max={99999999}  
                  autoHidden
                  className="input-price"              
                />
              </TableCell>
              <TableCell>{formatMoney(item.lineAmount || 0)}</TableCell>
              <TableCell>
                <IconButton
                  style={{ width: 20, height: 20 }}
                  onClick={() => {
                    deleteLineItem(item.productId);
                  }}
                >
                  <CloseSmallIcon style={{ width: 10, height: 10 }} />
                </IconButton>
              </TableCell>
            </TableBody>
          ))}
      </Table>
      {(!lineItems || lineItems.length === 0) && (
        <Box style={{ margin: "auto", padding: "24px" }}>
          <BoxNoDataComponent width="150px" />
          <Button variant="outlined" color="primary" style={{margin: "auto", marginTop: 10}} onClick={() => {document.getElementById("buttonF3")?.click();}}>Thêm sản phẩm</Button>
        </Box>
      )}
    </Fragment>
  );
};

import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
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
  const { } = props;
  const { lineItems, updateLineItem, deleteLineItem, context, order } = useOrderStore();
  
  return (
    <Fragment>
      <Table stickyHeader>
        <TableHead>
          <TableCell>STT</TableCell>
          <TableCell>Tên mặt hàng</TableCell>
          <TableCell>Số lượng</TableCell>
          <TableCell>Giá tiền</TableCell>
          <TableCell>Thành tiền</TableCell>
          {(context !== "detail" && order && order?.paymentStatus === 1 && order?.status === 1) || (context === "create") && (<TableCell></TableCell>)}
        </TableHead>
        {lineItems &&
          lineItems.map((item, index) => (
            <TableBody key={item.productId}>
              <TableRow>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  {(context !== "detail" && order && order?.paymentStatus === 1 && order?.status === 1) || (context === "create") ? (
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
                  ) : (<Typography>{item.quantity}</Typography>)}
                </TableCell>
                <TableCell>
                  {(context !== "detail" && order && order?.paymentStatus === 1 && order?.status === 1 ) || (context === "create") ?  (<InputQuantity
                    value={item.price}
                    onChange={(value) => {
                      updateLineItem(
                        { ...item, price: value },
                        item.productId
                      );
                    }}
                    name={"price"}
                    max={99999999}
                    autoHidden
                    className="input-price"
                  />) : (<Typography>{formatMoney(item.price || 0)}</Typography>)}
                </TableCell>
                <TableCell>{formatMoney(item.lineAmount || 0)}</TableCell>
                {(context !== "detail" && order && order?.status === 1 && order?.paymentStatus === 1) || (context === "create") && (
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
                )}
              </TableRow>
              {item.isShow && (item.combo && item.variants && item.variants.length > 0 && item.variants.map((variant, index) => (
                  <TableRow key={index} >
                    <TableCell style={{ border: "none" }} />
                    <TableCell style={{ background: "#F2F9FF" }}>{variant.name}</TableCell>
                    <TableCell align="center" colSpan={2} style={{ background: "#F2F9FF" }}>{`${((variant.quantity || 1) * item.quantity)} x ${formatMoney(variant.price || 0)}`}</TableCell>
                    <TableCell style={{ border: "none" }} />
                    {context !== "detail" && order && order?.status === 1 && order?.paymentStatus === 1 && <TableCell style={{ border: "none" }}/>}
                  </TableRow>
                )))
              }
              {!item.isShow ?
                ((item.combo && item.variants && item.variants.length > 0) &&
                  <TableRow>
                    <TableCell style={{ border: "none" }} />
                    <TableCell colSpan={4} style={{ border: "none" }}><Button variant="text" onClick={() => {
                      updateLineItem({ ...item, isShow: true }, item.productId
                      )
                    }} color="primary">Xem combo</Button></TableCell>
                    {(context !== "detail" && order && order?.status === 1 && order?.paymentStatus === 1) || (context === "create") && <TableCell style={{ border: "none" }} />}
                  </TableRow>
                ) : ((item.combo && item.variants && item.variants.length > 0) && <TableRow>
                  <TableCell style={{ border: "none" }} />
                  <TableCell colSpan={4} style={{ border: "none" }}><Button variant="text" onClick={() => {
                    updateLineItem({ ...item, isShow: false }, item.productId
                    )
                  }} color="primary">Rút gọn</Button></TableCell>
                  {(context !== "detail" && order && order?.status === 1 && order?.paymentStatus === 1 ) || (context === "create")  && <TableCell style={{ border: "none" }} />}
                </TableRow>)
              }
            </TableBody>
          ))}
      </Table>
      <Box style={{ height: 10 }}></Box>
      {(!lineItems || lineItems.length === 0) && (
        <Box style={{ margin: "auto", padding: "24px" }}>
          <BoxNoDataComponent width="150px" />
          <Button variant="outlined" color="primary" style={{ margin: "auto", marginTop: 10 }} onClick={() => { document.getElementById("buttonF3")?.click(); }}>Thêm sản phẩm</Button>
        </Box>
      )}
    </Fragment>
  );
};

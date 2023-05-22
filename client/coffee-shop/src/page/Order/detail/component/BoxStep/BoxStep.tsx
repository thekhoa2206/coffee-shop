import React, { memo, useMemo } from "react";
import { Box, Step, StepLabel, Stepper, Typography } from "@material-ui/core";
import clsx from "clsx";
import { formatDateTime } from "utilities";
import { colorInk } from "theme/palette";
import { AppState } from "store/store";
import { connect, ConnectedProps } from "react-redux";
import useStyles from "./BoxStep.styles";
import CancelIcon from "@material-ui/icons/Cancel";
import { OrdersResponse } from "services/OrdersService";
import { OrderStatus } from "page/Order/list/OrdersFilter/OrdersQuickFilter.consant";

interface BoxStepProps {
    order?: OrdersResponse;
}
const BoxStep = memo((props: BoxStepProps & PropsFromRedux) => {
    const classes = useStyles();
    const { order } = props;
    // Đặt giao => Chờ tài xế => Đang lấy hàng => Lấy hàng thất bại => Đang giao hàng => Đã hủy => Hoàn thành => giao hàng thất bại
    const isCompleted = useMemo(() => order?.status === OrderStatus.FINISH, [order?.status]);
    const isDraft = useMemo(() => order?.status === OrderStatus.DRAFT, [order?.status]);
    const isReadyPick = useMemo(() => order?.status === OrderStatus.READY_TO_PICK, [order?.status]);
    const isPicking = useMemo(() => order?.status === OrderStatus.PICKING, [order?.status]);
    const isPickingFailed = useMemo(() => order?.status === OrderStatus.PICKING_FAILED, [order?.status]);
    const isDelivering = useMemo(() => order?.status === OrderStatus.DELIVERING, [order?.status]);
    const isCancel = useMemo(() => order?.status === OrderStatus.CANCEL, [order?.status]);
    const isDeliveringFailed = useMemo(() => order?.status === OrderStatus.DELIVERING_FAILED, [order?.status]);
    const isReturning = useMemo(() => order?.status === OrderStatus.RETURNING, [order?.status]);
    const isReturned = useMemo(() => order?.status === OrderStatus.RETURNED, [order?.status]);

    const steps: { label: string; time?: string }[] = useMemo(
        () => [
            {
                label: "Đặt giao",
                time: order?.createdOn ? formatDateTime(order?.createdOn) : "",
            },
            { label: "Chờ tài xế", time: formatDateTime(new Date()) },
            {
                label: order?.status === OrderStatus.PICKING_FAILED ?  "Lấy hàng thất bại" :  "Đang lấy hàng",
                time: formatDateTime(new Date()),
            },
            {
                label: order?.status === OrderStatus.DELIVERING_FAILED ? "Giao hàng thất bại" : (order?.status === OrderStatus.RETURNING || order?.status === OrderStatus.RETURNED) ?  "Đang trả hàng" : "Đang giao hàng",
                time: formatDateTime(new Date()),
            },
            {
                label: order?.status === OrderStatus.CANCEL ? "Huỷ đơn" : (order?.status === OrderStatus.RETURNING || order?.status === OrderStatus.RETURNED) ?  "Đã trả hàng" : "Hoàn thành",
                time: order?.completedOn ? formatDateTime(order?.completedOn) : "",
            },
        ],
        [order]
    );
    return (
        <Box style={{ margin: "0 0 48px 4px" }}>
            <Stepper alternativeLabel classes={{ root: classes.stepper }}>
                {steps.map((step, idx) => (
                    <Step
                        key={idx}
                        className={clsx({ [classes.stepCancelled]:  ( idx === 4 && order?.status === OrderStatus.CANCEL) || (idx === 2 && order?.status === OrderStatus.PICKING_FAILED) || (idx === 3 && order?.status === OrderStatus.DELIVERING_FAILED) })}
                        disabled={
                            !(
                                idx === 0 ||
                                (idx === 1 && (isReadyPick || isPickingFailed || isPicking || isDelivering || isCompleted || isDeliveringFailed || isCancel || isReturning)) ||
                                (idx === 2 && (isPicking || isDelivering || isCompleted || isDeliveringFailed || isCancel || isReturning)) ||
                                (idx === 3 && (isDelivering || isCompleted || isDeliveringFailed || isCancel || isReturning)) ||
                                (idx === 4 && order?.status === OrderStatus.CANCEL) ||
                                (isCompleted || isReturned)
                            )
                        }
                        active={
                            idx === 0 ||
                            (idx === 1 && (isReadyPick || isPickingFailed || isPicking || isDelivering || isCompleted || isDeliveringFailed || isCancel)) ||
                            (idx === 2 && (isPicking || isDelivering || isCompleted || isDeliveringFailed || isCancel)) ||
                            (idx === 3 && (isDelivering || isCompleted || isDeliveringFailed || isCancel || isReturning)) ||
                            (idx === 4 && order?.status === OrderStatus.CANCEL) ||
                            (isCompleted || isReturned)
                        }
                        completed={
                            idx === 0 ||
                            (idx === 1 && (isReadyPick || isPickingFailed || isPicking || isDelivering || isCompleted || isDeliveringFailed || isCancel)) ||
                            (idx === 2 && (isPicking || isDelivering || isCompleted || isDeliveringFailed || isCancel)) ||
                            (idx === 3 && (isDelivering || isCompleted || isDeliveringFailed || isCancel || isReturning)) ||
                            (idx === 4 && order?.status === OrderStatus.CANCEL ) ||
                            (isCompleted || isReturned)
                        }
                    >
                        <StepLabel StepIconComponent={(( idx === 4 && order?.status === OrderStatus.CANCEL) || (idx === 2 && order?.status === OrderStatus.PICKING_FAILED) || (idx === 3 && order?.status === OrderStatus.DELIVERING_FAILED)) ? CancelIcon : undefined}>
                            <Typography>{step.label}</Typography>
                            {!!step.time && <Typography style={{ color: colorInk.base60, fontSize: "12px" }}>{step.time}</Typography>}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
});

const mapStateToProps = ({ }: AppState) => ({

});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(BoxStep);

import React, { memo, useMemo } from "react";
import { Box, Step, StepLabel, Stepper, Typography } from "@material-ui/core";
import clsx from "clsx";
import { formatDateTime } from "utilities";
import { colorInk } from "theme/palette";
import { AppState } from "store/store";
import { connect, ConnectedProps } from "react-redux";
import useStyles from "./BoxStep.styles";
import CancelIcon from "@material-ui/icons/Cancel";
import { OrderStatus } from "page/Orders/utils/OrderContants";
import { OrderResponse } from "services/OrderService";

interface BoxStepProps {
    order?: OrderResponse;
}
const BoxStep = memo((props: BoxStepProps & PropsFromRedux) => {
    const classes = useStyles();
    const { order } = props;
    const isDraft = useMemo(() => order?.status === OrderStatus.DRAFT, [order?.status]);
    const isCompleted = useMemo(() => order?.status === OrderStatus.COMPLETED, [order?.status]);
    const isInProgress = useMemo(() => order?.status === OrderStatus.IN_PROGRESS, [order?.status]);
    const isWaitingDelivery = useMemo(() => order?.status === OrderStatus.WAITING_DELIVERY, [order?.status]);
    const isDeleted = useMemo(() => order?.status === OrderStatus.DELETED, [order?.status]);

    const steps: { label: string; time?: string }[] = useMemo(
        () => [
            {
                label: "Đặt đồ",
                time: order?.createdOn ? formatDateTime(order?.createdOn) : "",
            },
            {
                label: "Đang pha chế",
                time: isInProgress && order?.createdOn ? formatDateTime(order?.createdOn) : "",
            },
            {
                label: "Chờ lấy đồ",
                time: isWaitingDelivery && order?.createdOn ? formatDateTime(order?.createdOn) : "",
            },
            {
                label: order?.status === OrderStatus.DELETED ? "Huỷ đơn" : "Hoàn thành",
                time: (isDeleted || isCompleted) && order?.modifiedOn ? formatDateTime(order?.modifiedOn) : "",
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
                        className={clsx({[classes.stepCancelled]:  (idx === 2 && order?.status === OrderStatus.DELETED)} )}
                        disabled={
                            !(
                                idx === 0 ||
                                (idx === 1 && (isDeleted || isCompleted || isWaitingDelivery || isInProgress)) ||
                                (idx === 2 && (isDeleted || isCompleted || isWaitingDelivery)) ||
                                (idx === 3 && order?.status === OrderStatus.DELETED) || (isCompleted)
                            )
                        }
                        active={
                            idx === 0 ||
                            (idx === 1 && (isDeleted || isCompleted || isWaitingDelivery || isInProgress)) ||
                            (idx === 2 && (isDeleted || isCompleted || isWaitingDelivery )) ||
                            (idx === 3 && order?.status === OrderStatus.DELETED) || (isCompleted)
                        }
                        completed={
                            idx === 0 ||
                            (idx === 1 && (isDeleted || isCompleted || isWaitingDelivery || isInProgress)) ||
                            (idx === 2 && (isDeleted || isCompleted || isWaitingDelivery )) ||
                            (idx === 3 && order?.status === OrderStatus.DELETED) || (isCompleted)
                        }
                    >
                        <StepLabel StepIconComponent={((idx === 2 && order?.status === OrderStatus.DELETED)) ? CancelIcon : undefined}>
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

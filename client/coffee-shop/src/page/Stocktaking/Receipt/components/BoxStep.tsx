import React, { memo, useMemo } from "react";
import { Box, Step, StepLabel, Stepper, Typography } from "@material-ui/core";
import clsx from "clsx";
import { formatDateTime } from "utilities";
import { colorInk } from "theme/palette";
import { AppState } from "store/store";
import { connect, ConnectedProps } from "react-redux";
import useStyles from "./BoxStep.styles";
import CancelIcon from "@material-ui/icons/Cancel";
import { OrderResponse } from "services/OrderService";
import { StocktakingReponse } from "services/StocktakingService";
import { ReeceiptStatus } from "page/Stocktaking/utils/StocktakingContants";

interface BoxStepProps {
    stock?: StocktakingReponse;
}
const BoxStep = memo((props: BoxStepProps & PropsFromRedux) => {
    const classes = useStyles();
    const { stock } = props;
    const isDraft = useMemo(() => stock?.status === ReeceiptStatus.ORDER, [stock?.status]);
    const isCompleted = useMemo(() => stock?.status === ReeceiptStatus.WAREHOUSE, [stock?.status]);
    const isWarehouse = useMemo(() => stock?.status === ReeceiptStatus.WAREHOUSE, [stock?.status]);
    const isDeleted = useMemo(() => stock?.status === ReeceiptStatus.DELETED, [stock?.status]);
    const steps: { label: string; time?: string }[] = useMemo(
        () => [
            {
                label: "Đặt hàng",
                time: stock?.createdOn ? formatDateTime(stock?.createdOn) : "",
            },
            {
                label: stock?.status === ReeceiptStatus.DELETED ? "Huỷ phiếu" : "Nhập kho",
                time: stock?.modifiedOn ? formatDateTime(stock?.modifiedOn) : "",
            },
        ],
        [stock]
    );
    return (
        <Box style={{ margin: "0 0 48px 4px" }}>
            <Stepper alternativeLabel classes={{ root: classes.stepper }}>
                {steps.map((step, idx) => (
                    <Step
                        key={idx}
                        className={clsx({[classes.stepCancelled]:  (idx === 2 && stock?.status === ReeceiptStatus.DELETED)} )}
                        disabled={
                            !(
                                idx === 0 ||
                                (idx === 1 && (isDeleted || isCompleted || isWarehouse)) ||
                                (idx === 2 && stock?.status === ReeceiptStatus.DELETED) || (isCompleted)
                            )
                        }
                        active={
                            idx === 0 ||
                            (idx === 1 && (isDeleted || isCompleted || isWarehouse)) ||
                            (idx === 2 && stock?.status === ReeceiptStatus.DELETED) || (isCompleted)
                        }
                        completed={
                            idx === 0 ||
                            (idx === 1 && (isDeleted || isCompleted || isWarehouse)) ||
                            (idx === 2 && stock?.status === ReeceiptStatus.DELETED) || (isCompleted)
                        }
                    >
                        <StepLabel StepIconComponent={((idx === 2 && stock?.status === ReeceiptStatus.DELETED)) ? CancelIcon : undefined}>
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

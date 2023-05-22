import { FormikErrors } from "formik";
import create, { SetState } from "zustand";
import { CustomerRequest, OrderRequest, ProductItemRequest } from "./CreateOrder.types";


const initOrder = {
    lineItems: [{
        id: 1,
    }],
    orderRequest: {},
    customer: {},
    errors: {},
};

export const useOrderStore = create<OrderStore>((set) => ({
    ...initOrder,
    set: set,
    deleteEverything: () =>
        set((prev) => ({
            ...prev,
            ...initOrder,
            lineItems: [],
        })),
    addProductLineItem: () =>
        set((prev) => {
            debugger
            const maxValue = Math.max(...prev.lineItems.map((p) => p.id));
            return ({
                ...prev,
                lineItems: [...(prev.lineItems || []), {
                    id: maxValue > 0 ? maxValue + 1 : maxValue - 1,
                }],
            })
        }),
    updateProductLineItem: (lineItem: ProductItemRequest) =>
        set((prev) => ({
            lineItems: prev.lineItems.map((item) =>
                item.id === lineItem.id ? lineItem : item
            ),
        })),
    deleteProductLineItem: (id: number) =>
        set((prev) => {
            if (prev.lineItems.length > 1) {
                let newFulfillLineItems = prev.lineItems.filter((item) => item.id !== id);
                return {
                    ...prev,
                    lineItems: newFulfillLineItems,
                };
            }
            return {
                ...prev,
                fulfillLineItems: prev.lineItems.filter((item) => item.id !== id),
            };
        }),
}));

export type OrderStore = {
    set: SetState<OrderStore>;
    orderRequest: OrderRequest | null;
    deleteEverything: () => void;
    addProductLineItem: () => void;
    updateProductLineItem: (lineItem: ProductItemRequest) => void;
    lineItems: ProductItemRequest[];
    deleteProductLineItem: (id: number) => void;
    customer: CustomerRequest;
    errors: FormikErrors<{
        phone?: string | null;
        name?: string | null;
        address?: string | null;
        nameProduct?: string | null;
        width?: string | null;
        height?: string | null;
        high?: string | null;
        weightValue?: string | null;
        city?: string | null;
        ward?: string | null;
        district?: string | null;
      }>;
};

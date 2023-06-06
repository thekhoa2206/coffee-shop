import ItemDetail from "page/Items/detail/ItemDetail";
import { CustomerResponse } from "services/CustomerService";
import { ProductResponse } from "services/ProductService";
import create, { SetState } from "zustand";
import { LineItemStore } from "../list/Orders.types";
export type OrderStore = {
    lineItems?: LineItemStore[] | null;
    customer?: CustomerResponse | null;

    note?: string | null;
    set: SetState<OrderStore>;
    addLineItem: (product: ProductResponse) => void;
    deleteLineItem: (id: number) => void;
    updateLineItem: (product: LineItemStore, id: number) => void;
}

export const initOrderStore = {
    lineItems: null,
    customer: null,
}
export const useOrderStore = create<OrderStore>((set) => ({
    ...initOrderStore,
    set: set,
    addLineItem: (product) => {
        set((prev) => {
            if (prev.lineItems && prev.lineItems.length > 0) {
                let lineItemOld = prev.lineItems.find((li) => ((product.combo && li.combo && li.productId == product.id) || (!product.combo && !li.combo && li.productId == product.variants[0].id)));
                if(lineItemOld){
                    return {
                        ...prev,
                        lineItems: [
                            ...prev.lineItems?.map((li) => {
                                if ((product.combo && li.combo && li.productId == product.id) || (!product.combo && !li.combo && li.productId == product.variants[0].id)) {
                                    return {
                                        ...li,
                                        quantity: li.quantity+1,
                                    }
                                } else {
                                    return li;
                                }
                            }) || [],
                        ]
                    };
                }else {
                    return {
                        ...prev,
                        lineItems: [...prev.lineItems, {
                            combo: product.combo || false,
                            price: (product.combo ? product.price : product.variants[0].price) || 0,
                            productId: product.combo ? product.id : product.variants[0].id,
                            quantity: 1,
                            name: product.combo ? product.name : (product.name + " - " + product.variants[0].name),
                        }]
                    } ;
                }
                
            } else {
                return {
                    ...prev,
                    lineItems: [{
                        combo: product.combo || false,
                        price: (product.combo ? product.price : product.variants[0].price) || 0,
                        productId: product.combo ? product.id : product.variants[0].id,
                        quantity: 1,
                        name: product.combo ? product.name : (product.name + " - " + product.variants[0].name),
                    }]
                } ;
            }
        })
    },
    deleteLineItem: (id) => {
        set((prev) => ({
            ...prev,
            lineItems: [
                ...(prev.lineItems?.filter((item) => item.productId !== id) || []),
            ],
        }))
    },
    updateLineItem: (product, id) => {
        set((prev) => {
            if(prev.lineItems){
                let lineItems = prev.lineItems.map((item) => {
                    if(item.productId == id){
                        return product;
                    }else {
                        return item;
                    }
                })
                return {
                    ...prev,
                    lineItems: lineItems || [],
                }
            } else return prev;
        })
    }
}))
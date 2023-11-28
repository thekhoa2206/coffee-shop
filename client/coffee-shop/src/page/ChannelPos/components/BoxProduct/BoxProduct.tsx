
import { Box, Typography } from "@material-ui/core";
import Image from "components/Image";
import InputQuantity from "components/InputQuantity";
import NumberInputTextField from "components/NumberInput/NumberInputTextField";
import { DataSource } from "components/Select/types";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import Avatar from "react-avatar";
import ProductService, { ProductFilterRequest, ProductResponse } from "services/ProductService";

export type BoxProductProps = {

}

export const BoxProduct = (props: BoxProductProps) => {
    const [filter, setFilter] = useState<ProductFilterRequest>({
        page: 1,
        limit: 20,
        query: '',
        combo: true
    });
    const [data, setData] = useState<DataSource>();
    const initData = async () => {
        let res = await ProductService.filter(filter);
        if (res.data.data) {
            let products: ProductResponse[] = [];
            res.data.data.map((item) => {
                if (!item.combo) {
                    if (
                        item.variants != null &&
                        item.variants.length > 0
                    ) {
                        item.variants?.map((v) => {
                            let product: ProductResponse = {
                                ...item,
                                variants: [v],
                                name: `${item.name} - ${v.name}`,
                                available: v.available,
                            };
                            products.push(product);
                        });
                    }
                } else {
                    let availables = item.variants.map(
                        (v) => v.available || 0
                    );
                    products.push({
                        ...item,
                        available: Math.min(...availables),
                    });
                }
            });
            setData({
                data: products,
                metaData: {
                    totalItems: res.data.metadata?.total || 0,
                    totalPage: Math.ceil(
                        (res.data.metadata?.total || 0) / (filter.limit || 10)
                    )
                }
            })

        }
    }

    useEffect(() => {
        initData();
    }, []);
    console.log(data);

    return (
        <Box style={{ flexWrap: "wrap", display: "flex", maxHeight: 1000 }}>
            {data?.data && data.data.map((product) => (
                <Box key={product.id} style={{ width: 120, height: 200, padding: 10, margin: "5px" }}>
                    <Box style={{ width: 90, height: 90, margin: "auto" }}>
                        {product?.imageUrl ? (<Image src={product?.imageUrl || ""} style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "6px"
                        }} />
                        ) : (
                            <Box
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    background: "#E8EAEB",
                                    borderRadius: "6px",
                                    margin: "auto"
                                }}
                            >
                                <Avatar size="80" color="#B1AFAF" round="6px" name={product.name} maxInitials={2} />
                            </Box>
                        )}
                    </Box>
                    <Box style={{ height: 34 }}>
                        <InputQuantity
                            onChange={() => { }}
                            name={"quantity"}
                            max={99999999}
                            className="input-price"
                            autoHidden
                            styleInput={{
                                textAlign: "center",
                            }}
                            value={0}
                        />
                    </Box>
                    <Box style={{ height: 80 }}><Typography>{product.name}</Typography></Box>
                </Box>
            ))}
        </Box>
    );
};

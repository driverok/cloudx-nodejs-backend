'use strict';
import { productHandler, stockHandler } from "../../handlers";
import { Stock } from "../../handlers/stockHandler";
import { Product } from "../../handlers/productHandler";
import {middyfy} from "@libs/lambda";
import schema from "./schema";
import { formatJSONResponse } from "@libs/api-gateway";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

export const productsById: ValidatedEventAPIGatewayProxyEvent<
    typeof schema
    > = async (event) => {
    const { id } = event.pathParameters
    try {
        const product: Product = await productHandler.getProduct(id);
        const stocks: Stock[] = await stockHandler.getStockByProductId(id);
        if (!product) {
            return formatJSONResponse({
                items: "Product not found",
                statusCode: 404
            });
        }
        return formatJSONResponse({
            items: [{ ...product, count: stocks?.length > 0 ? stocks[0].stock : 0 }]
        });

    } catch (err) {
        return formatJSONResponse({
            message: err.messsage,
            statusCode: 500
        });
    }
};

export const main = middyfy(productsById);

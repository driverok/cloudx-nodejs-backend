import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { productHandler } from "../../handlers";
import { Product } from "../../handlers/productHandler";
import schema from "./schema";
import { Stock } from "../../handlers/stockHandler";

export const createProduct: ValidatedEventAPIGatewayProxyEvent<
    typeof schema
    > = async (event) => {

    try {
        const {title, description, count, price} = event.body
        const product = {title, description, price}
        const stock = { stock: count || 0}
        const result = await productHandler.createProduct(product as Product, stock as Stock);
        return formatJSONResponse({
            items: [result],
            statusCode: 201
        });
    } catch (err) {
        return formatJSONResponse({
            message: err.messsage,
            statusCode: 500
        });
    }
};



export const main = middyfy(createProduct);

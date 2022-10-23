'use strict';
import { middyfy } from "@libs/lambda";
import { productHandler, stockHandler } from "../../handlers";
import { Stock } from "../../handlers/stockHandler";
import { Product } from "../../handlers/productHandler";
import {formatJSONResponse} from "@libs/api-gateway";


export const products = async () => {
    try {
        const productsData: Product[] = await productHandler.getProducts();
        const stocks: Stock[] = await stockHandler.getStocks();

        const items = productsData.map(product => {
            const stock: Stock = stocks.find(stock => stock.productId === product.id);
            return ({
                ...product,
                count: stock?.stock || 0,
            })
        })
        return formatJSONResponse({
            items
        });
    } catch (err) {
        return formatJSONResponse({
            message: err.messsage,
            statusCode: 500
        });
    }
};

export const main = middyfy(products);

import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import StockHandler from "./stockHandler";
import ProductHandler from "./productHandler";

const createDynamoDBClient = (): DocumentClient => {
    if (process.env.IS_OFFLINE) {
        return new AWS.DynamoDB.DocumentClient({
            region: "localhost",
            endpoint: "http://localhost:5000",
        });
    }

    return new AWS.DynamoDB.DocumentClient();
};

const client = createDynamoDBClient();

const productHandler = new ProductHandler(client);
const stockHandler = new StockHandler(client);
export { productHandler, stockHandler }

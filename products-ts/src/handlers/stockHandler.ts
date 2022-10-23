import { DocumentClient, TransactWriteItem } from "aws-sdk/clients/dynamodb";
import * as uuid from "uuid";

export type Stock = {
  id?: string;
  productId: string;
  stock: number;
};

export default class StockHandler {
  private client: DocumentClient;
  private tableName: string = "stocks";

  constructor(client: DocumentClient) {
    this.client = client;
  }

  getCreateStockItem = (stock: Stock): TransactWriteItem => {
  return {
  Put: {
      //@ts-ignore
      Item: {
      id: uuid.v4(),
      ...stock,
    },
    TableName: this.tableName,
  },
};
};

async getStockByProductId(productId: string): Promise<Stock[] | undefined> {
  const result = await this.client
    .scan({
      TableName: this.tableName,
      FilterExpression: "#productId = :id",
      ExpressionAttributeNames: {'#productId': 'productId'},
      ExpressionAttributeValues: {
        ":id": productId,
      },
    })
    .promise();

  return result.Items as Stock[];
}

async getStocks(): Promise<Stock[]> {
  const result = await this.client
    .scan({
      TableName: this.tableName,
    })
    .promise();
  return result.Items as Stock[];
}
}

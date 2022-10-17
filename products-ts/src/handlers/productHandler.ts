import { DocumentClient, TransactWriteItem } from "aws-sdk/clients/dynamodb";
import * as uuid from "uuid";
import { Stock } from "./stockHandler";
import { stockHandler } from "./index";

export type Product = {
  id?: string;
  title: string;
  description: string;
  price: number;
};

export default class ProductHandler {
  private client: DocumentClient;
  private tableName: string = "products";

  constructor(client: DocumentClient) {
    this.client = client;
  }

  getCreateProductItem = (product: Product): TransactWriteItem => {
  return {
  Put: {
    // @ts-ignore
    Item: {
      ...product,
    },
    TableName: this.tableName,
  },
};
};

async getProduct(id: string): Promise<Product | undefined> {
  const result = await this.client
    .get({
      TableName: this.tableName,
      Key: { id },
    })
    .promise();

  return result.Item as Product;
}

async getProducts(): Promise<Product[]> {
  const result = await this.client
    .scan({
      TableName: this.tableName,
    })
    .promise();
  return result.Items as Product[];
}

async createProduct(product: Product, stock: Stock) {
  const productId = uuid.v4();
  const productTransactItem = this.getCreateProductItem({...product, id: productId});
  const stockTransactItem = stockHandler.getCreateStockItem({...stock, productId});

  await this.client
    .transactWrite({
      TransactItems: [productTransactItem, stockTransactItem]
    })
    .promise();

  return {...product, id: productId, count: stock.stock};
}
}

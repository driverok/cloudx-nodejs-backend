const productsData = require("./resources/productsMock.json");
const stockData = require("./resources/stockMock.json");

let AWS = require("aws-sdk");

const productsPrepared = productsData.map(({ id, title, description, price }) => ({
  PutRequest: {
    Item: {
      id: {
        S: id,
      },
      title: {
        S: title,
      },
      description: {
        S: description,
      },
      price: {
        N: price,
      },
    },
  },
}));

const stockPrepared = stockData.map(({ id, productId, count }) => ({
  PutRequest: {
    Item: {
      id: {
        S: id,
      },
      productId: {
        S: productId,
      },
      stock: {
        N: count,
      },
    },
  },
}));

AWS.config.update({ region: "eu-west-1" });
const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const handler = function (err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
};

dynamodb.batchWriteItem(
  {
    RequestItems: {
      products: [...productsPrepared],
    },
  },
  handler
);

dynamodb.batchWriteItem(
  {
    RequestItems: {
      stocks: [...stockPrepared],
    },
  },
  handler
);

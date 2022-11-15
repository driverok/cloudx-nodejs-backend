'use strict';
const aws = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');

const REGION = "eu-west-1";
aws.config.update({region: REGION});
const corsConfig = {
  "Access-Control-Allow-Origin" : "*",
  "Access-Control-Allow-Credentials" : true
}

module.exports.catalogBatchProcess = (event) => {
  const products = event.Records.map(({body}) => body)
  const ddbClient = new aws.DynamoDB({region: REGION});
  const batchProducts = []

  const params = {
    TableName: "products",
  };

  const paramsStock = {
    TableName: "stocks",
  }

  do {
    const product = products.shift()
    const item = product.split(',')
    const productId = uuidv4();

    params.Item = {
      id: {S: productId},
      title: {S: item[0]},
      description: {S: item[1]},
      price: {N: item[2]}
    }

    paramsStock.Item = {
      product_id: {S: productId},
      count: {S: item[3]}
    }

    try {
      ddbClient.putItem(params, function(err, data) {
        if (err) {
          console.log("Error to dynamodb products", err);
        } else {
          console.log("Success to dynamodb products", data);
        }
      });
      ddbClient.putItem(paramsStock, function(err, data) {
        if (err) {
          console.log("Error to dynamodb stock", err);
        } else {
          console.log("Success to dynamodb stock", data);
        }
      });
      batchProducts.push(params.Item)
      console.log(`product ${JSON.stringify(params.Item)} added to db successfully`)
    } catch (err) {
      console.log(`there was an error trying to create product ${JSON.stringify(params.Item)} in the db`)
    }
  } while (products.length >= 1)

  const snsParams = {
    Message: `Following products were created on DynamoDB ${process.env.PRODUCT_TABLE_NAME} table.
    ${JSON.stringify(batchProducts)}`,
    TopicArn: process.env.SNS_ARN
  };

  const publishTextPromise = new aws.SNS({apiVersion: '2010-03-31'}).publish(snsParams).promise();

  publishTextPromise.then(
    function(data) {
      console.log(`Message ${snsParams.Message} sent to the topic ${snsParams.TopicArn}`);
      console.log("MessageID is " + data.MessageId);
    }).catch(
    function(err) {
      console.error(err, err.stack);
    });

  return {
    statusCode: 200,
    headers: corsConfig,
    body: JSON.stringify({message: "catalogBatchProcess executed successfully"}, null, 2),
  };
}

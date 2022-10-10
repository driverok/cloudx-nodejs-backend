'use strict';

exports.products = async (event, context) => {
  const { productsData } = await import('./stubProducts.mjs');
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    body: JSON.stringify(productsData)
  }
};


exports.lambdaHandler = async (event, context) => {
  const { App } = await import('./lib/app.mjs');
  return new App(event, context);
}

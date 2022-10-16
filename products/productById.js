'use strict';

exports.productById = async (event) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers" : "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  };
  const found = []
  const { id } = event.pathParameters
  const { productsData } = await import('./stubProducts.mjs');
  try {
    let found = productsData.reduce(function (accumulator, currentValue) {
      if (currentValue.id === id) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);
    if (found.length === 0) {
      throw new Error(`Incorrect product ID: "${id}"`);
    }
    body = JSON.stringify(found[0])
  } catch (err) {
    statusCode = 400;
    body = err.message
  }
  console.log(found)

  return {
    statusCode: statusCode,
    headers: headers,
    body: body
  };
};

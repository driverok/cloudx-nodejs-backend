'use strict';
const aws = require("aws-sdk")

module.exports.importProductsFile = async (event) => {
  const s3 = new aws.S3({region: 'eu-west-1'});
  const {name} = event.queryStringParameters || "";
  const BUCKET = "cloudx-nodejs-backend-import-bucket2"
  const catalogPath = "uploaded/" + name
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  const params = {
    Bucket: BUCKET,
    Key: catalogPath,
    Expires: 60,
    ContentType: "text/csv"
  }
  const url = s3.getSignedUrl('putObject', params);
  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify(url)
  };
};

import type { AWS } from '@serverless/typescript';

import products from "./src/functions/products";
import productsById from "./src/functions/productsById";
import createProduct from "./src/functions/createProduct";

// import createProduct from "@functions/createProduct";
// import hello from '@functions/hello';

const serverlessConfiguration: AWS = {
  service: 'products-ts',
  frameworkVersion: '3',
  plugins: [
    "serverless-esbuild",
  ],
  provider: {
    name: 'aws',
    region: "eu-west-1",
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:DeleteItem",
            ],
            // Resource: `arn:aws:dynamodb:eu-west-1:${process.env.BD_ID}:table/products`,
            Resource: "arn:aws:dynamodb:eu-west-1:007756198797:table/products",
          },
          {
            Effect: "Allow",
            Action: [
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:DeleteItem",
            ],
            // Resource: `arn:aws:dynamodb:eu-west-1:${process.env.BD_ID}:table/stocks`,
            Resource: "arn:aws:dynamodb:eu-west-1:007756198797:table/stocks",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { productsById, products, createProduct},
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;

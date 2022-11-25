import { BatchWriteItemCommand } from '@aws-sdk/client-dynamodb'
import { ddbClient } from './ddbClient.js'

const insertProducts = async (products) => {
  const params = {
    RequestItems: {
      products: products.map((productItem) => {
        return {
          PutRequest: {
            Item: {
              id: { S: productItem.id },
              title: { S: productItem.title },
              description: { S: productItem.description },
              price: { N: productItem.price.toString() },
            }
          }
        }
      })
    }
  }

  try {
    await ddbClient.send(new BatchWriteItemCommand(params))
    return true
  } catch (err) {
    console.log('Error while inserting products to DB: ', err.message)
    return false
  }
}

const insertStocks = async (stocks) => {
  const params = {
    RequestItems: {
      stocks: stocks.map((stockItem) => {
        return {
          PutRequest: {
            Item: {
              product_id: { S: stockItem.product_id },
              count: { N: stockItem.count.toString() },
            }
          }
        }
      })
    }
  }

  try {
    await ddbClient.send(new BatchWriteItemCommand(params))
    return true
  } catch (err) {
    console.log('Error while inserting stocks to DB: ', err.message)
    return false
  }
}

export { insertProducts, insertStocks }
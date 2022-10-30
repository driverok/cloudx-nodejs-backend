### Run tests
node --experimental-vm-modules node_modules/jest/bin/jest.js

### Endpoints:
GET - https://t7d2mfkw2c.execute-api.eu-west-1.amazonaws.com/dev/products
GET - https://t7d2mfkw2c.execute-api.eu-west-1.amazonaws.com/dev/products/{id}

### Functions:
getProductsList: products-dev-getProductsList (107 kB)
getProductById: products-dev-getProductById (107 kB)

### Task 5
endpoint: GET - https://ve4mmnsdpj.execute-api.eu-west-1.amazonaws.com/dev/import
functions:
importProductsFile: import-service-dev-importProductsFile (16 MB)
importFileParser: import-service-dev-importFileParser (16 MB)

Frontend https://dad3wh4lmgokq.cloudfront.net/admin/products

CSV parser results are logged into cloudwatch

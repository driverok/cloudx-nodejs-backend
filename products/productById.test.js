const productById = require('./productById')
const event = {
  "pathParameters": {
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a3"
  }
}
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Headers" : "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
};
const expected =  {
  body: JSON.stringify({
      description: "Short Product Description 3",
      id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
      price: 23,
      title: "Product 3",
    }),
  statusCode: 200,
  headers: headers,

}
test('Valid API call', async () => {
  const actual = await productById.productById(event)
  console.log(actual)
  console.log(expected)
  expect(actual).toMatchObject(expected);
});

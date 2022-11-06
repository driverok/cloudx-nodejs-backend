const aws = require("aws-sdk");
const csv = require('csv-parser');

const s3 = new aws.S3({region: 'eu-west-1'});
const bucket = "cloudx-nodejs-backend-import-bucket2"
const headers = {'Access-Control-Allow-Origin': '*'}

  function parseFile(fileName) {
  const s3Params = {
    Bucket: bucket,
    Key: fileName,
  }

  return new Promise((resolve) => {
    let results = [];
    s3.getObject(s3Params).createReadStream().pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(results);
        return resolve('Success: ' + results)
      });
  });
}

module.exports.importFileParser = async (event) => {
  try {
    let tasks = []
    event.Records.forEach((record) => {
      tasks.push(parseFile(record.s3.object.key))
      console.log('working with ', record.s3.object.key)
    });

    await Promise.all(tasks);

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({message: `All line have been processed.`}),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({message: `Error: ${e}`}),
    };
  }
};

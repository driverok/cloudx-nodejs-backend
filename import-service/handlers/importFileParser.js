const aws = require("aws-sdk");
const { parse } = require('csv-parse');
const { v4: uuidv4 } = require('uuid');

const region = 'eu-west-1';
aws.config.update({region: region});
const s3 = new aws.S3({region: region});
const bucket = "cloudx-nodejs-backend-import-bucket2";
const headers = {'Access-Control-Allow-Origin': '*'};
const SQS = new aws.SQS({apiVersion: '2012-11-05'})

function sendToQueue(data) {
  const params = {
    MessageBody: data.toString(),
    QueueUrl: "https://sqs.eu-west-1.amazonaws.com/007756198797/catalogItemsQueue",
  }
  console.log(data.toString());
  SQS.sendMessage(params, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Successfully added message", data.MessageId);
    }
  });
}


function parseFile(fileName) {
  const s3Params = {
    Bucket: bucket,
    Key: fileName,
  }

  return new Promise((resolve) => {
    s3.getObject(s3Params).createReadStream().pipe(parse({
      delimiter: ','
    }))
      .on('data', (data) => sendToQueue(data))
      .on('end', () => {
        return resolve('Success: ')
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

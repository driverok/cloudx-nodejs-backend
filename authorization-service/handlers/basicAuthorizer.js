// const { Buffer } = require('node:buffer');
const generatePolicy = (principalId, Resource, Effect) => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: {
      Action: 'execute-api:Invoke',
      Effect,
      Resource,
    },
  },
});

module.exports.basicAuthorizer = async (event, _context, cb) => {
  console.log('event', event);
  if (event.type !== 'TOKEN') {
   cb('Unauthorized');
  }
  try {
    const { authorizationToken } = event;
    console.log(authorizationToken);
    const encodedCreds = authorizationToken.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const plainCreds = buff.toString('utf-8').split(':');
    const [username, password] = plainCreds;
    console.log('username', username);
    console.log('password', password);
    const storedUserPassword = process.env[username];
    console.log('storedUserPassword', storedUserPassword);
    const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';
    console.log('effect', effect);
    const policy = generatePolicy(encodedCreds, event.methodArn, effect);
    console.log('policy', policy);

    cb(null, policy);
  }
  catch ( err ) {
    cb('Unauthorized');
  }
}

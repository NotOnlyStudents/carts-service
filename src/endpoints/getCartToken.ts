import {
  APIGatewayProxyEvent,
  Callback,
  Context,
  Handler,
} from 'aws-lambda';

const handler: Handler = async (
  // TODO: rename to event
  _event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback,
) => {
  try {
    // callback(null, await getCart(event));
  } catch (error) {
    callback(error);
  }
};

export default handler;

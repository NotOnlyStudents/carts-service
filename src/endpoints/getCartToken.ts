import {
  APIGatewayProxyEvent,
  Callback,
  Context,
  Handler,
} from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { ClientConfiguration } from 'aws-sdk/clients/dynamodb';
import { parseDocument } from 'yaml';
import { readFileSync as readFile } from 'fs';
import getCartToken from 'src/lambdas/getCartToken';
import DynamoDbCartRepository from 'src/repository/DynamoDbCartRepository';

const handler: Handler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback,
) => {
  try {
    const dynamoConfig: ClientConfiguration = parseDocument(readFile(process.env.DYNAMODB_CONFIG_FILE_PATH, 'utf-8')).toJSON();
    const repository = new DynamoDbCartRepository(new DynamoDB(dynamoConfig));

    callback(null, await getCartToken(event, repository));
  } catch (error) {
    callback(error);
  }
};

export default handler;

import {
  APIGatewayProxyEvent,
  Handler,
} from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { ClientConfiguration } from 'aws-sdk/clients/dynamodb';
import { parseDocument } from 'yaml';
import { readFileSync as readFile } from 'fs';
import getCartToken from 'src/lambdas/getCartToken';
import DynamoDbCartRepository from 'src/repository/DynamoDbCartRepository';
import getUsername from 'src/utils/getUsername';

const handler: Handler = async (
  event: APIGatewayProxyEvent
) => {
  const dynamoConfig: ClientConfiguration = parseDocument(readFile(process.env.DYNAMODB_CONFIG_FILE_PATH, 'utf-8')).toJSON();
  const repository = new DynamoDbCartRepository(new DynamoDB(dynamoConfig));

  const username = getUsername(event);

  return await getCartToken(username, repository);
};

export default handler;

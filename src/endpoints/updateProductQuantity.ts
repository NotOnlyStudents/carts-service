import {
  APIGatewayProxyEvent,
  Handler,
} from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { ClientConfiguration } from 'aws-sdk/clients/dynamodb';
import { parseDocument } from 'yaml';
import { readFileSync as readFile } from 'fs';
import updateProductQuantity from 'src/lambdas/updateProductQuantity';
import DynamoDbCartRepository from 'src/repository/DynamoDbCartRepository';
import getUsername from 'src/utils/getUsername';

const handler: Handler = async (
  event: APIGatewayProxyEvent,
) => {
  const dynamoConfig: ClientConfiguration = parseDocument(readFile(process.env.DYNAMODB_CONFIG_FILE_PATH, 'utf-8')).toJSON();
  const repository = new DynamoDbCartRepository(new DynamoDB(dynamoConfig));

  const username = await getUsername(event);

  return updateProductQuantity(username, repository);
};

export default handler;

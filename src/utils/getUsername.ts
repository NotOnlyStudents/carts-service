import {
  APIGatewayProxyEvent
} from 'aws-lambda';

const getUsername = (event: APIGatewayProxyEvent): string => {
  if (process.env.IS_OFFLINE) {
    return "1";
  } else {
    return event.requestContext.authorizer.claims['conito:username'];
  }
}

export default getUsername;
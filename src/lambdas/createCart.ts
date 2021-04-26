import { SNSMessage, SQSEvent } from "aws-lambda";
import DynamoDbCart from "src/models/DynamoDbCart";
import Cart from "src/models/interfaces/Cart";
import NewUserMessage from "src/models/messages/NewUserMessage";
import CartRepositoryPost from "src/repository/interfaces/CartRepositoryPost";
import * as Validator from "validatorjs";

const createCart = async (
  event: SQSEvent,
  repository: CartRepositoryPost
): Promise<Cart> => {
  const record = event.Records[0];
  console.log(record);

  const msg: SNSMessage = JSON.parse(record.body);
  const payload: NewUserMessage = JSON.parse(msg.Message);
  const validator = new Validator(payload, { username: 'required|string' });

  if (validator.passes()) {
    return repository.createCart(new DynamoDbCart(payload.username));
  }
}

export default createCart;
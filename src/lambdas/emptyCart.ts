import { SNSMessage, SQSEvent } from 'aws-lambda';
import Cart from 'src/models/interfaces/Cart';
import PaymentSuccessfulMessage from 'src/models/messages/PaymentSuccessfulMessage';
import CartRepositoryPatch from 'src/repository/interfaces/CartRepositoryPatch';
import * as Validator from 'validatorjs';

const emptyCart = async (
  event: SQSEvent,
  repository: CartRepositoryPatch,
): Promise<Cart> => new Promise((resolve, reject) => {
  const record = event.Records[0];

  const msg: SNSMessage = JSON.parse(record.body);
  const payload: PaymentSuccessfulMessage = JSON.parse(msg.Message);
  const validator = new Validator(payload, {
    cartId: 'required|string',
    // paymentIntent: 'required|string'
  });

  if (validator.passes()) {
    // TODO: check
    resolve(repository.updateCart(payload.cartId, []));
  }
  reject(validator);
});

export default emptyCart;

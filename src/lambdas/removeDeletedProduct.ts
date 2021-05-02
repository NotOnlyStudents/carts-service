import { SNSMessage, SQSEvent } from 'aws-lambda';
import Product from 'src/models/interfaces/Product';
import ProductDeletedMessage from 'src/models/messages/ProductDeletedMessage';
import CartRepositoryDelete from 'src/repository/interfaces/CartRepositoryDelete';
import * as Validator from 'validatorjs';

const emptyCart = async (
  event: SQSEvent,
  repository: CartRepositoryDelete,
): Promise<AsyncIterableIterator<Product>> => new Promise((resolve, reject) => {
  const record = event.Records[0];
  const msg: SNSMessage = JSON.parse(record.body);
  const payload: ProductDeletedMessage = JSON.parse(msg.Message);
  const validator = new Validator(payload, {
    productId: 'required|string'
  });

  if (validator.passes()) {
    resolve(repository.deleteProduct(payload.productId));
  }
  reject(validator.errors);
});

export default emptyCart;

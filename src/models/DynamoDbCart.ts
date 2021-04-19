import { embed } from '@aws/dynamodb-data-mapper';
import {
  attribute,
  hashKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';
import DynamoDbProduct from './DynamoDbProduct';
import Cart from './interfaces/Cart';

@table(process.env.CARTS_TABLE)
class DynamoDbCart implements Cart {
  @hashKey()
  id: string;

  @attribute({ memberType: embed(DynamoDbProduct) })
  products: DynamoDbProduct[];

  constructor(id = '', products: DynamoDbProduct[] = []) {
    this.id = id;
    this.products = products;
  }
}

export default DynamoDbCart;

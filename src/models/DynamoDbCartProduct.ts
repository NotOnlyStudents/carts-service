import {
  attribute,
  hashKey,
  rangeKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';
import Product from './interfaces/Product';

@table(process.env.CARTS_TABLE)
class DynamoDbCartProduct implements Product {
  @rangeKey()
  id: string;

  @attribute()
  name: string;

  @attribute()
  description: string;

  @attribute()
  price: number;

  @attribute()
  quantity: number;

  @attribute()
  available: boolean;

  @attribute()
  evidence: boolean;

  @attribute()
  categories: string[];

  @attribute()
  images: string[];

  @hashKey()
  cartId: string;

  constructor(id = '', cartId = '', name = '', description = '', price = 0.0, quantity = 1, available = true, evidence = false, categories = [], images = []) {
    this.id = id;
    this.cartId = cartId;
    this.name = name;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.available = available;
    this.evidence = evidence;
    this.categories = categories;
    this.images = images;
  }
}

export default DynamoDbCartProduct;

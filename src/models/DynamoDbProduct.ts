import {
  attribute,
  hashKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';
import Product from './interfaces/Product';

@table(process.env.PRODUCTS_TABLE)
class DynamoDbProduct implements Product {
  @hashKey()
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

  constructor(id = '', name = '', description = '', price = 0.0, quantity = 1, available = true, evidence = false, categories = [], images = []) {
    this.id = id;
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

export default DynamoDbProduct;

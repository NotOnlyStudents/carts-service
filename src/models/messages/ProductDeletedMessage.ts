export default class ProductDeletedMessage {
  constructor(readonly productId: string) {
    this.productId = productId;
  }
}

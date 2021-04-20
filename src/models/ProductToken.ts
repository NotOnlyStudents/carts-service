
import * as SHA256 from "crypto-js/sha256";
import Product from "./interfaces/Product";
import Token from "./interfaces/Token";
import TokenValidator from "./interfaces/TokenValidator";

class ProductToken implements Token<Product>, TokenValidator {
  token: { 
    data: Product; 
    timeout: Date;
  };
  hmac: string;

  constructor(token: ProductToken) {
    this.token = {
      ...token.token
    };
    this.hmac = token.hmac;
  }
  
  signToken = () => SHA256(JSON.stringify(this.token)).toString()

  checkTimout = () => new Date(this.token.timeout) >= new Date()

  checkHmac = () => this.hmac === this.signToken()

  checkToken = () => this.checkTimout() && this.checkHmac()
}

export default ProductToken;
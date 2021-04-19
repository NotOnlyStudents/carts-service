interface Token<T> {
  token: {
    data: T;
    timeout: Date;
  },
  hmac: string
}

export default Token;

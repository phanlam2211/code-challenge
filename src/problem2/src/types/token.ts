export interface Token {
  symbol: string;
  name: string;
  icon: string;
  price?: number;
}

export interface TokenPair {
  from: Token;
  to: Token;
  amount: number;
  rate: number;
} 
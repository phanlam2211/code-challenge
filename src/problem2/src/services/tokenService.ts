import axios from 'axios';
import type { Token } from '../types/token';

const TOKEN_ICONS_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/d27f9c059cc52c7864bb70995560d8fd15083d9a/tokens';
const PRICE_API_URL = 'https://interview.switcheo.com/prices.json';

interface PriceData {
  currency: string;
  date: string;
  price: number;
}

export const getTokenIcon = (symbol: string): string => {
  return `${TOKEN_ICONS_BASE_URL}/${symbol}.svg`;
};

export const fetchTokenPrice = async (symbol: string): Promise<number | undefined> => {
  try {
    const response = await axios.get<PriceData[]>(PRICE_API_URL);
    const latestPrice = response.data
      .filter(item => item.currency === symbol)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    return latestPrice?.price;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return undefined;
  }
};

export const getAvailableTokens = async (): Promise<Token[]> => {
  try {
    const response = await axios.get<PriceData[]>(PRICE_API_URL);
    const uniqueTokens = Array.from(new Set(response.data.map(item => item.currency)));
    
    const tokens: Token[] = uniqueTokens.map(symbol => ({
      symbol,
      name: symbol, // You might want to add a mapping for full names
      icon: getTokenIcon(symbol),
    }));

    // Fetch prices for all tokens
    const tokensWithPrices = await Promise.all(
      tokens.map(async (token) => ({
        ...token,
        price: await fetchTokenPrice(token.symbol)
      }))
    );

    return tokensWithPrices.filter(token => token.price !== undefined);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return [];
  }
}; 
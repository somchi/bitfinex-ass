export type Asset = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
};

export type Order = {
  price: number;
  quantity: number;
  total?: number;
};

export type AppStore = {
  bids: Order[];
  asks: Order[];
  loading: boolean;
  maxTotalAsks: number;
  maxTotalBids: number;
};

export type BitOrder = {
  price: number;
  count: number;
  quantity: number;
  total?: number;
};

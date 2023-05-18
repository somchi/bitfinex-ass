export enum ORDER_TYPE {
  BID,
  ASK,
}
export const ORDERBOOK_LEVELS = 25;
export const RequestId = '123e4567-e89b-12d3-a456-426655440000';
export const Symbol = 'tBTCUSD';
export const EventName = 'subscribe';
export const Channel = 'book';

export const PRECISION = {
  '0': 5,
  '1': 4,
  '2': 3,
  '3': 2,
  '4': 1,
};

export enum FREQUENCY {
  F0 = 'F0',
  F1 = 'F1',
}

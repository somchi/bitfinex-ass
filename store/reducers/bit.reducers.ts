import {
  addDepths,
  addTotalToOrder,
  compareBitOrders,
  getMaxTotalSum,
} from '../../utils/helper';
import { PayloadAction, createSlice, current } from '@reduxjs/toolkit';
import { AppStore } from '../../utils/types';

const InitialState: AppStore = {
  bids: [] as any[],
  asks: [] as any[],
  loading: false,
  maxTotalAsks: 0,
  maxTotalBids: 0,
};

export const bitSlice = createSlice({
  name: 'bit',
  initialState: InitialState,
  reducers: {
    setRawBid: (state: AppStore, actions: PayloadAction<any[]>) => {
      const currBids = actions.payload;
      const bids = addTotalToOrder(currBids);
      const max = getMaxTotalSum(bids);
      const bidDepth = addDepths(bids, max);
      state.maxTotalBids = max;
      state.bids = bidDepth;
    },
    setBitBids: (state: AppStore, actions: PayloadAction<any[]>) => {
      const currBids = actions.payload;
      const updateBids = compareBitOrders(current(state.bids), currBids);
      const bids = addTotalToOrder(updateBids);

      const max = getMaxTotalSum(bids);
      state.maxTotalBids = max;
      const bidDepth = addDepths(bids, current(state).maxTotalBids);
      state.bids = bidDepth;
    },
    setRawAsks: (state: AppStore, actions: PayloadAction<any[]>) => {
      const currAsks = actions.payload;
      const asks = addTotalToOrder(currAsks);
      const max = getMaxTotalSum(asks);
      state.maxTotalAsks = max;
      const askDepth = addDepths(asks, max);
      state.asks = askDepth;
    },
    setBitAsks: (state: AppStore, actions: PayloadAction<any[]>) => {
      const currAsks = actions.payload;
      const updateAsks = compareBitOrders(current(state.asks), currAsks);
      const asks = addTotalToOrder(updateAsks);

      const max = getMaxTotalSum(asks);
      state.maxTotalAsks = max;
      const askDepth = addDepths(asks, current(state).maxTotalAsks);
      state.asks = askDepth;
    },
    setLoading: (state: AppStore, actions: PayloadAction<boolean>) => {
      state.loading = actions.payload;
    },
    clearState: (state: AppStore) => {
      state.asks = [];
      state.bids = [];
      state.maxTotalAsks = 0;
      state.maxTotalBids = 0;
    },
  },
});

export const {
  setBitBids,
  setBitAsks,
  setRawBid,
  setRawAsks,
  setLoading,
  clearState,
} = bitSlice.actions;

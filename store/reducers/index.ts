import { combineReducers } from '@reduxjs/toolkit';
import { bitSlice } from './bit.reducers';

export const reducers = combineReducers({
  bit: bitSlice.reducer,
});

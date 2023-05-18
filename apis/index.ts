import axios from 'axios';
import { generateUrl } from '../utils/helper';
import { API_URL } from '../config';

export const getInitialOrder = async (precision: number) => {
  const url = generateUrl(`${API_URL}/book/t${'BTCUSD'}/P${precision}`, {
    len: 25,
  });
  const response = await axios.get(url);
  return response;
};

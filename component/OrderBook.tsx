import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
  Button,
  ScrollView,
  Image,
} from 'react-native';
import { OrderBookTable } from './OrderBookTable';
import { Channel, EventName, ORDER_TYPE, Symbol } from '../utils/constants';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { useEffect, useMemo, useState } from 'react';
import { formatBitData, formatBitDataOne } from '../utils/helper';
import {
  clearState,
  setBitAsks,
  setBitBids,
  setLoading,
  setRawAsks,
  setRawBid,
} from '../store/reducers/bit.reducers';
import { WEBSOCKET_URL } from '../config';
import { getInitialOrder } from '../apis';

const OrderBook = () => {
  const { sendJsonMessage, getWebSocket } = useWebSocket(WEBSOCKET_URL, {
    shouldReconnect: (closeEvent) => true,
    onMessage: (event: WebSocketEventMap['message']) => processMessages(event),
  });
  const { height, width } = useWindowDimensions();

  const [precision, setPres] = useState<number>(0);

  const bitSelector = useAppSelector((state) => state.bit);
  const dispatch = useAppDispatch();

  const initialData = () => {
    dispatch(setLoading(true));
    getInitialOrder(precision)
      .then((res) => {
        const formatData = formatBitData(res.data);

        dispatch(setRawBid(formatData.bids));
        dispatch(setRawAsks(formatData.asks));
        dispatch(setLoading(false));
      })
      .catch(() => {
        dispatch(setLoading(false));
      });
  };

  useEffect(() => {
    initialData();
  }, []);

  const connect = () => {
    const message = {
      event: EventName,
      channel: Channel,
      symbol: Symbol,
      prec: `P${precision}`,
      freq: 'F0',
      len: '25',
      subId: 123,
    };
    sendJsonMessage(message);
  };

  const disconnect = () => {
    getWebSocket()?.close();
    const message = {
      event: 'unsubscribe',
      channel: Channel,
      subId: 123,
    };
    sendJsonMessage(message);
  };

  useEffect(() => {
    connect();
  }, [sendJsonMessage, getWebSocket]);

  const processMessages = (event: any) => {
    const response = JSON.parse(event.data);
    const payload = response[1];
    let formatData: any = {};

    if (!Array.isArray(payload)) return;
    if (Array.isArray(payload[0])) {
      formatData = formatBitData(payload);
    } else {
      formatData = formatBitDataOne(payload);
    }

    if (formatData.bids.length !== 0) {
      dispatch(setBitBids(formatData.bids));
    }

    if (formatData.asks.length !== 0) {
      dispatch(setBitAsks(formatData.asks));
    }
  };

  const increacePrec = () => {
    const prec = precision + 1;
    if (precision < 5) {
      disconnect();
      dispatch(clearState());
      setPres(prec);
      initialData();
    }
  };

  const decreasePrec = () => {
    const prec = precision - 1;
    if (precision >= 0 && precision < 5) {
      disconnect();
      dispatch(clearState());
      setPres(prec);
      initialData();
    }
  };

  const precFormater = useMemo(() => {
    return precision;
  }, [precision]);

  return (
    <SafeAreaView>
      <View>
        <Text style={styles.orderBookTitle}>ORDER BOOK</Text>
      </View>
      <ScrollView style={{ width, height }}>
        <View
          style={{
            flexDirection: 'row',
            zIndex: 8,
            justifyContent: 'flex-end',
            marginTop: 10,
            paddingHorizontal: 15,
          }}
        >
          <Button color="#03ca9b" title="Connect" onPress={() => connect()} />
          <View style={{ marginLeft: 5 }}>
            <Button
              color="#e44b44"
              title="Disconnect"
              onPress={() => disconnect()}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Image source={{ uri: './assets/zoom-in.png' }} />
            </View>
            <View>
              <Image source={{ uri: './assets/zoom-out.png' }} />
            </View>
          </View>
          <View
            style={{ flexDirection: 'row', marginRight: 15, marginVertical: 5 }}
          >
            <Text
              style={{ ...styles.controls, marginRight: 15 }}
              disabled={precision === 0 ? true : false}
              onPress={() => decreasePrec()}
            >
              -
            </Text>
            <Text
              style={styles.controls}
              disabled={precision === 4 ? true : false}
              onPress={() => increacePrec()}
            >
              +
            </Text>
          </View>
        </View>
        {bitSelector.loading ? (
          <Text style={styles.loader}>Loading....</Text>
        ) : (
          <View style={{ ...styles.table, width }}>
            <OrderBookTable
              data={bitSelector.bids}
              orderType={ORDER_TYPE.BID}
              precision={precFormater}
            />
            <OrderBookTable
              data={bitSelector.asks}
              orderType={ORDER_TYPE.ASK}
              precision={precFormater}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loader: {
    fontSize: 18,
    color: '#9fa7ad',
    fontWeight: '700',
    textAlign: 'center',
  },
  orderBookTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
    marginTop: 32,
    paddingHorizontal: 32,
  },
  table: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    color: '#f194ff',
  },

  controls: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },
});

export default OrderBook;

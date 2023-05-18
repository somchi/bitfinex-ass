import { ORDER_TYPE } from '../utils/constants';
import { Order } from '../utils/types';
import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatNum } from '../utils/helper';

type Props = {
  data: Order[];
  orderType: number;
  precision: number;
};

export const OrderBookTable = memo(function OrderBookTable({
  data,
  orderType,
  precision,
}: Props) {
  const DepthVisualizerColors = {
    BIDS: '#113534',
    ASKS: '#3d1e28',
  };

  const renderOrders = () => {
    return [...data].map((item: any, index: number) => {
      const depth = item.depth;
      const left = orderType === ORDER_TYPE.BID ? `${100 - depth}%` : 0;
      return (
        <View
          key={item.amount + index + orderType}
          style={{ position: 'relative' }}
        >
          <View
            style={{
              backgroundColor: `${
                orderType === ORDER_TYPE.BID
                  ? DepthVisualizerColors.BIDS
                  : DepthVisualizerColors.ASKS
              }`,
              position: 'relative',
              top: 21,
              width: `${depth}%`,
              height: 22,
              marginTop: -24,
              zIndex: 0,
              left: left,
            }}
          ></View>
          {orderType === ORDER_TYPE.BID ? (
            <View style={{ ...styles.orderRow }}>
              <Text style={styles.orderRowData}>{formatNum(item.amount)}</Text>
              <Text style={{ ...styles.orderRowData, textAlign: 'left' }}>
                {formatNum(item.price)}
              </Text>
            </View>
          ) : (
            <View style={styles.orderRow}>
              <Text style={styles.orderRowData}>{formatNum(item.price)}</Text>
              <Text style={styles.orderRowData}>{formatNum(item.amount)}</Text>
            </View>
          )}
        </View>
      );
    });
  };

  const tableHeader = () => {
    return orderType === ORDER_TYPE.BID ? (
      <View style={styles.tableHeader}>
        <Text style={styles.tableTh}>AMOUNT</Text>
        <Text style={styles.tableTh}>PRICE</Text>
      </View>
    ) : (
      <View style={{ marginLeft: 5, ...styles.tableHeader }}>
        <Text style={styles.tableTh}>PRICE</Text>
        <Text style={styles.tableTh}>AMOUNT</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {tableHeader()}
      {renderOrders()}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#172d3e',
    width: '50%',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  orderRowData: {
    fontSize: 14,
    color: '#fff',
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableTh: {
    fontSize: 16,
    color: '#9fa7ad',
    fontWeight: '700',
  },
});

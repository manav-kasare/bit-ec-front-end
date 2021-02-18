import React from 'react';
import '../sockets/binance';
import {View, Text, SafeAreaView, StyleSheet, processColor} from 'react-native';
import {getBinanceData} from '../sockets/binance';
import CoinbasePro from './Chart/CoinbasePro';

const reducer = (state, action) => {
  switch (action.type) {
    case 'set':
      return {chartData: action.data};
    case 'append':
      const newState = state.chartData;
      newState.push(action.element);
      return {chartData: newState};
    default:
      return {chartData: state};
  }
};

import Binance from 'binance-api-react-native';

const client = Binance();

export default function Home() {
  const [{chartData}, dispatch] = React.useReducer(reducer, {chartData: []});
  const [interval, setInterval] = React.useState('1m');
  const [done, setDone] = React.useState(false);
  const [priceNow, setPriceNow] = React.useState('');

  React.useEffect(() => {
    fetch(
      `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${interval}`,
    )
      .then((response) => response.json())
      .then(handleHistories);
  }, [interval]);

  React.useEffect(() => {
    const clean = client.ws.candles('BTCUSDT', interval, handleBinanceData);
    return () => clean();
  }, [interval]);

  const handleBinanceData = (data) => {
    console.log(data);
    const candleDate = new Date(data.startTime);
    const modified = {
      date: data.startTime,
      day: candleDate.getDay(),
      open: data.open,
      close: data.close,
      high: data.high,
      low: data.low,
    };
    dispatch({type: 'append', element: modified});
    setPriceNow(`$ ${data.open.slice(0, -6)}`);
  };

  const handleHistories = (candles) => {
    let values = [];
    const promise = candles.map((candle) => {
      const candleDate = new Date(candle[0]);
      const element = {
        date: candle[0],
        day: candleDate.getDay(),
        high: candle[2],
        low: candle[3],
        open: candle[1],
        close: candle[4],
      };
      values.push(element);
    });
    Promise.all(promise).then(() => {
      dispatch({type: 'set', data: values});
      setDone(true);
      // getBinanceData(interval, handleBinanceData);
    });
  };

  return done ? (
    <CoinbasePro
      data={chartData}
      interval={interval}
      setInterval={setInterval}
      priceNow={priceNow}
    />
  ) : (
    <View style={styles.screen}></View>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: constants.width,
    height: constants.height,
    backgroundColor: 'white',
    justifyContent: 'space-around',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  chart: {
    flex: 1,
  },
});

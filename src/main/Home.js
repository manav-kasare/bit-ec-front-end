import Binance from 'binance-api-react-native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useGlobal} from 'reactn';
import {webSocket} from '../sockets';
import ChartView from './Chart/ChartView';

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

export default function Home() {
  const [user] = useGlobal('user');
  const [{chartData}, dispatch] = React.useReducer(reducer, {chartData: []});
  const [interval, setInterval] = React.useState('1m');
  const [done, setDone] = React.useState(false);
  const [priceNow, setPriceNow] = React.useState('');

  React.useEffect(() => {
    webSocket.connected(user._id);
  }, []);

  React.useEffect(() => {
    fetch(
      `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${interval}`,
    )
      .then((response) => response.json())
      .then(handleHistories);
  }, [interval]);

  // React.useEffect(() => {
  //   const clean = client.ws.candles('BTCUSDT', interval, handleBinanceData);
  //   return () => clean();
  // }, [interval]);

  // React.useEffect(() => {
  //   const clean = client.ws.depth('BTCUSDT', handleDepthData);
  //   return () => clean();
  // }, []);

  const handleDepthData = (data) => {
    const price = parseFloat(data.bidDepth[0].price.slice(0, -6));
    setPriceNow(price);
  };

  const handleBinanceData = (data) => {
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
    // setPriceNow(`$ ${data.open.slice(0, -6)}`);
  };

  const handleGetTicker = (data) => {
    console.log('ticker data', data);
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
    });
  };

  return done ? (
    <ChartView
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

Home.options = {
  topBar: {
    visible: false,
  },
};

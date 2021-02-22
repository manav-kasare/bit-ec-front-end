import Binance from 'binance-api-react-native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {ActivityIndicator} from 'react-native-paper';
import Animated, {add, eq, modulo, sub} from 'react-native-reanimated';
import {diffClamp, onGestureEvent, useValues} from 'react-native-redash';
import {useGlobal} from 'reactn';
import {webSocket} from '../../sockets';
import Chart from './Chart';
import Content from './Content';
import Header from './Header';
import Label from './Label';
import Line from './Line';
import Values from './Values';

const client = Binance();

export default function ChartView({componentId}) {
  const [user] = useGlobal('user');
  const [chartData, setChartData] = React.useState({});
  const [candles, setCandles] = React.useState([]);
  const [interval, setInterval] = React.useState('1m');
  const [done, setDone] = React.useState(false);
  const [priceNow, setPriceNow] = React.useState('');
  const [domain, setDomain] = React.useState([0, 1]);
  const caliber = constants.width / 25;
  const [x, y, state] = useValues(0, 0, State.UNDETERMINED);
  const gestureHandler = onGestureEvent({
    x,
    y,
    state,
  });
  const opacity = eq(state, State.ACTIVE);
  const translateY = diffClamp(y, 10, constants.width);
  const translateX = add(sub(x, modulo(x, caliber)), caliber / 2);
  const unsubscribe = React.useRef(null);

  React.useEffect(() => {
    webSocket.connected(user._id);
  }, []);

  React.useEffect(() => {
    if (unsubscribe.current) unsubscribe.current();
    setDone(false);
    setChartData({});
    setCandles([]);
    setDomain([0, 1]);
    fetch(
      `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${interval}&limit=25`,
    )
      .then((response) => response.json())
      .then(handleHistories);
  }, [interval]);

  React.useEffect(() => {
    unsubscribe.current = client.ws.candles(
      'BTCUSDT',
      interval,
      handleBinanceData,
    );
  }, [interval]);

  React.useEffect(() => {
    const clean = client.ws.depth('BTCUSDT', handleDepthData);
    return () => clean;
  }, [done]);

  const handleDepthData = (data) => {
    const price = parseFloat(data.bidDepth[0].price.slice(0, -6));
    setPriceNow(price);
  };

  const handleBinanceData = (data) => {
    const candleDate = new Date(data.startTime);
    const modified = {
      date: candleDate,
      day: candleDate.getDay(),
      open: data.open,
      close: data.close,
      volume: data.volume,
      high: data.high,
      low: data.low,
    };

    const lastDate = candles.length > 0 && candles.slice(-1)[0].date;

    if (Date.parse(lastDate) - Date.parse(candleDate) >= 0) {
      const _chartData = chartData;
      _chartData[candleDate] = modified;
      const newChartData = {...chartData, ..._chartData};
      setChartData(newChartData);
      handleSetCandles(newChartData);
    }
  };

  const handleHistories = (data) => {
    const _chartData = {};
    const promise = data.map((candle) => {
      const candleDate = new Date(candle[0]);
      const element = {
        date: candleDate,
        day: candleDate.getDay(),
        high: candle[2],
        low: candle[3],
        open: candle[1],
        close: candle[4],
        volume: candle[5],
      };
      _chartData[candleDate] = element;
    });
    Promise.all(promise).then(() => {
      setChartData(_chartData);
      handleSetCandles(_chartData);
      setDone(true);
    });
  };

  const handleSetCandles = (data) => {
    setCandles(Object.values(data));
    getDomain(Object.values(data));
  };

  const getDomain = (data) => {
    const values = data.map(({high, low}) => [high, low]).flat();
    const modified = [Math.min(...values), Math.max(...values)];
    if (modified[0] !== domain[0] && modified[1] !== domain[1]) {
      setDomain(modified);
    }
  };

  return done ? (
    <View style={styles.container}>
      <View>
        <Header
          interval={interval}
          setInterval={setInterval}
          priceNow={priceNow}
        />
        <Animated.View style={{opacity}} pointerEvents="none">
          <Values {...{candles, translateX, caliber}} />
        </Animated.View>
      </View>
      <View>
        <Chart {...{candles, domain}} />
        <PanGestureHandler minDist={0} {...gestureHandler}>
          <Animated.View style={StyleSheet.absoluteFill}>
            <Animated.View
              style={{
                transform: [{translateY}],
                opacity,
                ...StyleSheet.absoluteFillObject,
              }}>
              <Line x={constants.width} y={0} />
            </Animated.View>
            <Animated.View
              style={{
                transform: [{translateX}],
                opacity,
                ...StyleSheet.absoluteFillObject,
              }}>
              <Line x={0} y={constants.width} />
            </Animated.View>
            <Label y={translateY} {...{domain, opacity}} />
          </Animated.View>
        </PanGestureHandler>
      </View>
      <Content priceNow={priceNow} componentId={componentId} />
    </View>
  ) : (
    <View
      style={[
        styles.container,
        {alignItems: 'center', justifyContent: 'center'},
      ]}>
      <ActivityIndicator size="large" color="white" animating={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.primary,
  },
});

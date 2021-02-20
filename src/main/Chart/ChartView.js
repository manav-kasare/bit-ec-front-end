import React from 'react';
import {StyleSheet, View} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Animated, {
  add,
  diffClamp,
  eq,
  modulo,
  sub,
} from 'react-native-reanimated';
import {onGestureEvent, useValues} from 'react-native-redash';
import Chart, {size} from './Chart';
import Content from './Content';
import Header from './Header';
import Label from './Label';
import Line from './Line';
import Values from './Values';
import {
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryCandlestick,
} from 'victory-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.primary,
  },
});

export default function ChartView({data, interval, setInterval, priceNow}) {
  const [zoom, setZoom] = React.useState(0.5);
  const candles = data.slice(-(zoom * 50));
  const [x, y, state] = useValues(0, 0, State.UNDETERMINED);
  const gestureHandler = onGestureEvent({
    x,
    y,
    state,
  });
  const caliber = size / candles.length;
  const translateY = diffClamp(y, 10, size);
  const translateX = add(sub(x, modulo(x, caliber)), caliber / 2);
  const opacity = eq(state, State.ACTIVE);

  const getDomain = (rows) => {
    const values = rows.map(({high, low}) => [high, low]).flat();
    return [Math.min(...values), Math.max(...values)];
  };
  const domain = getDomain(candles);

  return (
    <>
      <View style={styles.container}>
        <View>
          <Header
            interval={interval}
            setInterval={setInterval}
            priceNow={priceNow}
            zoom={zoom}
            setZoom={setZoom}
          />
          <Animated.View style={{opacity}} pointerEvents="none">
            <Values {...{candles, translateX, caliber}} />
          </Animated.View>
        </View>
        <View>
          <Chart {...{candles, domain}} />
          {/* <VictoryChart
            width={size}
            height={size}
            theme={VictoryTheme.grayscale}
            domainPadding={{x: 5}}
            scale={{x: 'time'}}>
            <VictoryAxis tickFormat={(t) => `${t.getTime()}`} />
            <VictoryAxis dependentAxis />
            <VictoryCandlestick
              candleColors={{positive: '#37b526', negative: '#E33F64'}}
              animate={{
                duration: 1000,
                easing: 'elasticInOut',
                onLoad: {duration: 1000},
              }}
              candleWidth={(1 - zoom) * 10}
              data={candles}
            />
          </VictoryChart> */}
          <PanGestureHandler minDist={0} {...gestureHandler}>
            <Animated.View style={StyleSheet.absoluteFill}>
              <Animated.View
                style={{
                  transform: [{translateY}],
                  opacity,
                  ...StyleSheet.absoluteFillObject,
                }}>
                <Line x={size} y={0} />
              </Animated.View>
              <Animated.View
                style={{
                  transform: [{translateX}],
                  opacity,
                  ...StyleSheet.absoluteFillObject,
                }}>
                <Line x={0} y={size} />
              </Animated.View>
              <Label y={translateY} {...{size, domain, opacity}} />
            </Animated.View>
          </PanGestureHandler>
        </View>
        <Content priceNow={priceNow} />
      </View>
    </>
  );
}

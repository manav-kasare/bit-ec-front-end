import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import Animated, {
  concat,
  cond,
  divide,
  eq,
  floor,
  interpolate,
  lessThan,
  modulo,
  multiply,
  sub,
} from 'react-native-reanimated';
import {ReText} from 'react-native-redash';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    backgroundColor: '#FEFFFF',
    borderRadius: 4,
    padding: 4,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const formatInt = (value) => {
  const t = floor(divide(value, 1000));
  return cond(lessThan(t, 1), concat(t), concat(t, ',', modulo(value, 1000)));
};

const format = (value) => {
  if (Platform.OS === 'android') {
    return concat('$ ', divide(floor(multiply(value, 100)), 100));
  }
  const int = floor(value);
  const dec = floor(multiply(sub(value, int), 100));
  const formattedDec = cond(
    eq(dec, 0),
    '00',
    cond(lessThan(dec, 10), concat('0', dec), concat(dec)),
  );
  return concat('$', formatInt(int), '.', formattedDec);
};

export default ({domain: [min, max], y, opacity}) => {
  const value = interpolate(y, {
    inputRange: [0, constants.width],
    outputRange: [min, max],
  });
  return (
    <Animated.View
      style={[styles.container, {transform: [{translateY: y}], opacity}]}>
      <ReText
        text={format(value)}
        style={{color: 'black', fontVariant: ['tabular-nums']}}
      />
    </Animated.View>
  );
};

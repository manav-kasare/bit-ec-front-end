import React from 'react';
import {Line, Rect} from 'react-native-svg';

const MARGIN = 4;

export default ({candle, index, width, scaleY, scaleBody}) => {
  const {close, open, high, low} = candle;
  const fill = close > open ? '#37b526' : '#E33F64';
  const x = index * width;
  const max = Math.max(open, close);
  const min = Math.min(open, close);
  return (
    <>
      <Line
        x1={x + width / 2}
        y1={scaleY(low)}
        x2={x + width / 2}
        y2={scaleY(high)}
        stroke={fill}
        strokeWidth={1}
      />
      <Rect
        x={x + MARGIN}
        y={scaleY(max)}
        width={width - MARGIN * 2}
        height={scaleBody(max - min)}
        {...{fill}}
      />
    </>
  );
};

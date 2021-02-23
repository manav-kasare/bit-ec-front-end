import {scaleLinear} from 'd3-scale';
import React from 'react';
import {Svg} from 'react-native-svg';
import Candle from './Candle';

export default ({candles, domain}) => {
  const width = constants.width / candles.length;
  const scaleY = scaleLinear()
    .domain(domain)
    .range([constants.height * 0.45, 0]);
  const scaleBody = scaleLinear()
    .domain([0, Math.max(...domain) - Math.min(...domain)])
    .range([0, constants.width]);

  return (
    <Svg width={constants.width} height={constants.height * 0.45}>
      {candles.map((candle, index) => (
        <Candle key={index} {...{candle, index, width, scaleY, scaleBody}} />
      ))}
    </Svg>
  );
};

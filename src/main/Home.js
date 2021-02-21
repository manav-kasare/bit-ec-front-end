import React from 'react';
import ChartView from './Chart/ChartView';

export default function Home({componentId}) {
  return <ChartView componentId={componentId} />;
}

Home.options = {
  topBar: {
    visible: false,
  },
};

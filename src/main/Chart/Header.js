import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const formatInt = (value) => {
  const t = Math.floor(value / 1000);
  return t < 1 ? t : `${t}, ${value % 1000}`;
};

const formatValue = (value) => {
  const int = Math.floor(value);
  const dec = Math.floor((value - int) * 100);
  const formattedDec = dec === 0 ? '00' : dec < 10 ? `0${dec}` : `${dec}`;
  return `$ ${formatInt(int)}.${formattedDec}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  title: {
    color: 'white',
    fontVariant: ['tabular-nums'],
    fontSize: 30,
    fontWeight: '700',
  },
  rightColumn: {
    flex: 1,
    marginTop: -20,
  },
  leftColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 16,
  },
  tabContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    width: constants.width,
    alignSelf: 'center',
    justifyContent: 'space-around',
  },
  tab: {
    padding: 8,
  },
  tabLabel: {
    fontSize: 14,
    fontVariant: ['tabular-nums'],
    color: '#d3d3d3',
  },
  tabActive: {
    padding: 8,
    backgroundColor: '#d3d3d3',
    borderRadius: 8,
  },
  tabLabelActive: {
    fontSize: 14,
    fontVariant: ['tabular-nums'],
    color: '#222324',
    fontWeight: '500',
  },
});

const Tabs = ({tabs, interval, setInterval}) => {
  const handleTabPress = (tab) => {
    if (tab !== interval.toUpperCase()) {
      setInterval(tab);
    }
  };

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <TouchableWithoutFeedback
          onPress={() => handleTabPress(tab)}
          key={index}>
          <View style={tab === interval ? styles.tabActive : styles.tab}>
            <Text
              style={
                tab === interval ? styles.tabLabelActive : styles.tabLabel
              }>
              {tab.toUpperCase()}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      ))}
    </View>
  );
};

const Pricenow = ({priceNow}) => (
  <Text style={styles.title}>{formatValue(priceNow)}</Text>
);

export default ({interval, setInterval, priceNow}) => {
  const [priceChangePercent, setPriceChangePercent] = React.useState(null);

  React.useEffect(() => {
    fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT`)
      .then((response) => response.json())
      .then(handleGetTicker);
  }, []);

  const handleGetTicker = (data) => {
    setPriceChangePercent(data.priceChangePercent);
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.rightColumn}>
              <Text style={styles.title}>BTC - USD</Text>
            </View>
            <View style={styles.leftColumn}>
              <Pricenow priceNow={priceNow} />
              <Text
                style={[
                  styles.subtitle,
                  {color: priceChangePercent >= 0 ? '#37b526' : '#E33F64'},
                ]}>
                {priceChangePercent} %
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.tabs}>
          <Tabs
            interval={interval}
            tabs={['1m', '5m', '1h', '12h', '1d', '1w', '1M']}
            setInterval={setInterval}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

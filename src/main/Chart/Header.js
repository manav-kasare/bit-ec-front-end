import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

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
    fontSize: 20,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 16,
    color: '#d3d3d3',
  },
  rightColumn: {
    flex: 1,
  },
  leftColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  tabContainer: {
    backgroundColor: '#222324',
    borderRadius: 8,
    flexDirection: 'row',
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
  zoomActive: {
    fontSize: 14,
    fontVariant: ['tabular-nums'],
    color: 'white',
    fontWeight: '500',
  },
  zoomInactive: {
    fontSize: 14,
    fontVariant: ['tabular-nums'],
    color: 'grey',
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

const Zoom = ({zoom, setZoom}) => {
  const handlePlus = () => {
    if (zoom <= 1 && zoom > 0.25) {
      setZoom(zoom - 0.25);
    }
  };

  const handleMinus = () => {
    console.log('zoom', zoom);
    if (zoom >= 0 && zoom <= 0.75) {
      setZoom(zoom + 0.25);
    }
  };

  return (
    <View style={styles.tabContainer}>
      <TouchableWithoutFeedback onPress={handleMinus}>
        <View style={styles.tab}>
          <Feather
            style={zoom === 1 ? styles.zoomInactive : styles.zoomActive}
            name="minus"
            size={20}
          />
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={handlePlus}>
        <View style={styles.tab}>
          <Feather
            style={zoom === 0.25 ? styles.zoomInactive : styles.zoomActive}
            name="plus"
            size={20}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const Pricenow = ({priceNow}) => <Text style={styles.title}>{priceNow}</Text>;

export default ({interval, setInterval, priceNow, zoom, setZoom}) => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.rightColumn}>
              <Text style={styles.title}>BTC - USD</Text>
              <Text style={styles.subtitle}>2.2k BTC 24hr vol</Text>
            </View>
            <View style={styles.leftColumn}>
              <Pricenow priceNow={priceNow} />
              <Text style={[styles.subtitle, {color: '#4AFA9A'}]}>+5.11%</Text>
            </View>
          </View>
          <View style={styles.tabs}>
            <Tabs
              interval={interval}
              tabs={['1m', '5m', '1h', '12h', '1d', '1w', '1M']}
              setInterval={setInterval}
            />
            <Zoom zoom={zoom} setZoom={setZoom} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

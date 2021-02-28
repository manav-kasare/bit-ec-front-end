import React from 'react';
import {StyleSheet, View} from 'react-native';
import {List} from 'react-native-paper';
import {showOverlay} from '../../../navigation/functions';
import CreateBuyListing from './CreateBuyListing';
import CreateSellListing from './CreateSellListing';

export default function BuyOrSell({componentId}) {
  const handleBuy = () => {
    showOverlay('CustomModal', {
      children: () => <CreateBuyListing componentId={componentId} />,
      height: constants.height,
    });
  };
  const handleSell = () => {
    showOverlay('CustomModal', {
      children: () => <CreateSellListing componentId={componentId} />,
      height: constants.height,
    });
  };

  return (
    <View style={styles.modal}>
      <List.Item
        style={styles.tile}
        title={lang('addBuyListing')}
        titleStyle={styles.titleStyle}
        onPress={handleBuy}
      />
      <View style={styles.seperator} />
      <List.Item
        style={styles.tile}
        title={lang('addSellListing')}
        titleStyle={styles.titleStyle}
        onPress={handleSell}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: constants.width,
    height: constants.height * 0.25,
    backgroundColor: constants.primary,
  },
  seperator: {
    height: 0.3,
    width: constants.width * 0.95,
    position: 'relative',
    left: constants.width * 0.05,
    backgroundColor: 'grey',
  },
  tile: {
    height: constants.height * 0.1,
    width: constants.width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStyle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});

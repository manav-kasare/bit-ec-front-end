import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useGlobal} from 'reactn';
import {showOverlay} from '../../navigation/functions';
import BuyModal from './BuyModal';
import SellModal from './SellModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  tabs: {
    flexDirection: 'row',
    padding: 16,
  },
  tabActive: {
    borderBottomWidth: 1,
    borderColor: 'white',
    paddingBottom: 8,
  },
  tabLabelActive: {
    color: 'white',
    fontSize: 20,
  },
  tab: {
    borderBottomWidth: 1,
    borderColor: '#222324',
    paddingBottom: 8,
    flex: 1,
  },
  tabLabel: {
    fontSize: 20,
    color: '#222324',
    marginLeft: 16,
  },
  actions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  content: {
    justifyContent: 'center',
    marginLeft: 25,
  },
  bitcoinsBought: {
    color: 'white',
    fontSize: 24,
  },
  bitcoinsBoughtRight: {
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
  },
  bitcoinsBoughtView: {
    marginTop: 16,
    flexDirection: 'row',
  },
  values: {
    flex: 1,
  },
  value: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    borderRadius: 5,
    width: constants.width * 0.4,
    height: constants.height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 20,
  },
  profit: {
    color: '#37b526',
    fontSize: 20,
  },
  loss: {
    color: '#E33F64',
    fontSize: 20,
  },
  pl: {
    marginTop: 5,
  },
});

const Button = ({color, backgroundColor, label, onPress}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={[styles.button, {backgroundColor}]}>
      <Text style={[styles.label, {color}]}>{label}</Text>
    </View>
  </TouchableWithoutFeedback>
);

export default ({priceNow}) => {
  const [user] = useGlobal('user');

  const handleBuy = () => {
    showOverlay('CustomModal', {
      children: () => (
        <BuyModal priceNow={priceNow} componentId={componentId} />
      ),
      height: constants.height,
    });
  };

  const handleSell = () => {
    showOverlay('CustomModal', {
      children: () => (
        <SellModal priceNow={priceNow} componentId={componentId} />
      ),
      height: constants.height,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.tabs}>
          <View style={styles.tabActive}>
            <Text style={styles.tabLabelActive}>Wallet</Text>
          </View>
          {/* <View style={styles.tab}>
            <Text style={styles.tabLabel}>Trade History</Text>
          </View> */}
        </View>
        <View style={styles.content}>
          <View style={styles.bitcoinsBoughtView}>
            <Text style={styles.bitcoinsBought}>
              {user.bitcoinsBought} BTC,
            </Text>
            <Text style={styles.bitcoinsBoughtRight}>
              $ {user.bitcoinsBought * priceNow}
            </Text>
          </View>
          <View style={styles.pl}>
            <Text
              style={
                user.lastPrice - priceNow > 0 ? styles.profit : styles.loss
              }>
              Proit/Loss: ${' '}
              {(user.lastPrice - priceNow).toString().includes('.')
                ? (user.lastPrice - priceNow).toString().slice(0, -11)
                : (user.lastPrice - priceNow).toString() + '.00'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <Button
          label="Buy"
          backgroundColor={constants.accent}
          color="white"
          onPress={handleBuy}
        />
        <Button
          label="Sell"
          backgroundColor="#E33F64"
          color="white"
          onPress={handleSell}
        />
      </View>
    </SafeAreaView>
  );
};

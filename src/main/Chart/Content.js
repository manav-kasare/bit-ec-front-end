import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useGlobal} from 'reactn';
import {push, showOverlay} from '../../navigation/functions';
import BuyModal from './BuyModal';
import SellModal from './SellModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderColor: constants.primary,
    paddingBottom: 8,
    flex: 1,
  },
  tabLabel: {
    fontSize: 20,
    color: constants.primary,
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
    fontWeight: '700',
    fontSize: 24,
  },
  bitcoinsBoughtRight: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 10,
  },
  bitcoinsBoughtView: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
    width: constants.width * 0.25,
    height: constants.height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
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

export default ({componentId}) => {
  const [user] = useGlobal('user');
  const [priceNow] = useGlobal('priceNow');

  const handleBuy = () => {
    showOverlay('CustomModal', {
      children: () => <BuyModal componentId={componentId} />,
      height: constants.height,
    });
  };

  const handleSell = () => {
    showOverlay('CustomModal', {
      children: () => <SellModal componentId={componentId} />,
      height: constants.height,
    });
  };

  const handleTrade = () => {
    push(componentId, 'Trade');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.tabs}>
          <View style={styles.tabActive}>
            <Text style={styles.tabLabelActive}>Wallet</Text>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.bitcoinsBoughtView}>
            <Text style={styles.bitcoinsBought}>
              {user.bitcoinsBought
                ? user.bitcoinsBought.toString().includes('.') + ' '
                  ? user.bitcoinsBought.toString().slice(0, -15) + ' '
                  : user.bitcoinsBought.toString() + '.00' + ' '
                  ? user.bitcoinsBought + ' '
                  : 0 + ' '
                : 0 + ' '}
              BTC,
            </Text>
            <Text style={styles.bitcoinsBoughtRight}>
              ${' '}
              {user.bitcoinsBought * priceNow
                ? (user.bitcoinsBought * priceNow).toString().includes('.')
                  ? (user.bitcoinsBought * priceNow).toString().slice(0, -10)
                  : (user.bitcoinsBought * priceNow).toString() + '.00'
                  ? user.bitcoinsBought * priceNow
                  : 0
                : 0}
            </Text>
          </View>
          <View style={styles.pl}>
            <Text
              style={
                user.lastPrice - priceNow > 0 ? styles.profit : styles.loss
              }>
              Proit/Loss: ${' '}
              {(user.lastPrice - priceNow) * user.bitcoinsBought
                ? ((user.lastPrice - priceNow) * user.bitcoinsBought)
                    .toString()
                    .includes('.')
                  ? ((user.lastPrice - priceNow) * user.bitcoinsBought)
                      .toString()
                      .slice(0, -11)
                  : (
                      (user.lastPrice - priceNow) *
                      user.bitcoinsBought
                    ).toString() + '.00'
                : 0}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <Button
          label="Buy"
          backgroundColor="#37b526"
          color="white"
          onPress={handleBuy}
        />
        <Button
          label="Sell"
          backgroundColor="#E33F64"
          color="white"
          onPress={handleSell}
        />
        <Button
          label="Trade"
          backgroundColor={constants.accent}
          color="white"
          onPress={handleTrade}
        />
      </View>
    </SafeAreaView>
  );
};

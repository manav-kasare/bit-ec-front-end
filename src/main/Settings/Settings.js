import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {ActivityIndicator, List} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import {useGlobal} from 'reactn';
import {push} from '../../navigation/functions';
import {removeToken, removeUser} from '../../shared/asyncStorage';
import {setRoot} from '../../navigation/navStart';

export default function Settings({componentId}) {
  const setUser = useGlobal('user')[1];
  const setToken = useGlobal('token')[1];
  const setOverlayId = useGlobal('overlayId')[1];
  const setIsAdmin = useGlobal('isAdmin')[1];
  const setPriceNow = useGlobal('priceNow')[1];
  const [loading, setLoading] = React.useState(false);

  const handleTransactions = () => {
    push(componentId, 'Transactions');
  };

  const handleTrades = () => {
    push(componentId, 'Trades');
  };

  const handleChangeLanguage = () => {
    push(componentId, 'LanguageSetting');
  };

  const handleLogOut = async () => {
    setLoading(true);
    await removeUser();
    await removeToken();
    setUser({
      _id: '',
      name: '',
      bitcoinsBought: 0,
      lastPrice: 0,
      transactions: [],
    });
    setToken(null);
    setLoading(false);
    setRoot();
    setOverlayId(null);
    setIsAdmin(null);
    setPriceNow(null);
  };

  const right = () => <Feather name="chevron-right" color="white" size={25} />;

  return (
    <SafeAreaView style={styles.screen}>
      <List.Item
        title={lang('transactions')}
        titleStyle={styles.titleStyle}
        onPress={handleTransactions}
        right={right}
      />
      <View style={styles.seperator} />
      <List.Item
        title={lang('trades')}
        titleStyle={styles.titleStyle}
        onPress={handleTrades}
        right={right}
      />
      <View style={styles.seperator} />
      <List.Item
        title={lang('changeLanguage')}
        titleStyle={styles.titleStyle}
        onPress={handleChangeLanguage}
        right={right}
      />
      <View style={styles.seperator} />
      {loading ? (
        <View
          style={{
            width: constants.width,
            paddingVertical: 25,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="small" color="crimson" animating={true} />
        </View>
      ) : (
        <List.Item
          title={lang('logout')}
          titleStyle={[styles.titleStyle, {color: 'crimson'}]}
          onPress={handleLogOut}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: constants.primary,
  },
  titleStyle: {
    color: 'white',
    fontWeight: '600',
    fontSize: 25,
  },
  seperator: {
    height: 0.5,
    marginVertical: 1,
    width: constants.width * 0.95,
    position: 'relative',
    left: constants.width * 0.05,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});

Settings.options = {
  topBar: {
    title: {
      text: lang('settings'),
      fontSize: 25,
      fontWeight: '700',
    },
    borderColor: 'transparent',
    backButton: {
      showTitle: false,
    },
  },
};

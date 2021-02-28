import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {List} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import {useGlobal} from 'reactn';
import {push} from '../../navigation/functions';

export default function Settings({componentId}) {
  const handleTransactions = () => {
    push(componentId, 'Transactions');
  };

  const handleTrades = () => {
    push(componentId, 'Trades');
  };

  const handleChangeLanguage = () => {
    push(componentId, 'LanguageSetting');
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
    height: 0.3,
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

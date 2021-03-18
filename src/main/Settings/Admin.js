import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {List} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import {push} from '../../navigation/functions';

export default function Admin({componentId}) {
  const handleTransactions = () => {
    push(componentId, 'AllTransactions');
  };

  const handleTrades = () => {
    push(componentId, 'AllTrades');
  };

  const handleChangeLanguage = () => {
    push(componentId, 'LanguageSetting');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.headingView}>
          <Text style={styles.heading}>{lang('transactions')}</Text>
        </View>
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
      </View>
    </SafeAreaView>
  );
}

const right = () => <Feather name="chevron-right" color="white" size={25} />;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: constants.primary,
  },
  seperator: {
    height: 0.5,
    width: constants.width * 0.95,
    position: 'relative',
    left: constants.width * 0.05,
    backgroundColor: 'grey',
  },
  headingView: {
    width: constants.width,
    paddingLeft: 15,
    marginBottom: constants.height * 0.025,
  },
  heading: {
    fontSize: 30,
    fontWeight: '900',
    color: 'white',
  },
  content: {
    paddingBottom: constants.height * 0.05,
  },
  tile: {
    height: constants.height * 0.1,
    width: constants.width,
    alignItems: 'center',
  },
  titleStyle: {
    color: 'white',
    fontWeight: '600',
    fontSize: 25,
  },
});

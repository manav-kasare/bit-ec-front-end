import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useGlobal} from 'reactn';
import Feather from 'react-native-vector-icons/Feather';
import {storeLanguage} from '../../shared/asyncStorage';
import {List} from 'react-native-paper';
import {setMain} from '../../navigation/navStart';

export default function LanguageSetting() {
  const [language, setLanguage] = useGlobal('language');
  const [user] = useGlobal('user');

  const handleLanguage = async (code) => {
    setLanguage(code);
    setMain(user.phoneNumber);
    await storeLanguage(code);
  };

  const right = () => <Feather name="check" size={20} color="white" />;

  return (
    <View style={styles.screen}>
      <List.Item
        title="English"
        titleStyle={styles.titleStyle}
        onPress={language === 'es' ? () => handleLanguage('en') : () => {}}
        right={language !== 'es' ? right : () => <></>}
      />
      <View style={styles.seperator} />
      <List.Item
        title="Español"
        titleStyle={styles.titleStyle}
        onPress={language !== 'es' ? () => handleLanguage('es') : () => {}}
        right={language === 'es' ? right : () => <></>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: constants.primary,
  },
  seperator: {
    height: 0.3,
    marginVertical: 1,
    width: constants.width * 0.95,
    position: 'relative',
    left: constants.width * 0.05,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  titleStyle: {
    color: 'white',
    fontWeight: '600',
    fontSize: 25,
  },
});

LanguageSetting.options = {
  topBar: {
    title: {
      text: lang('changeLanguage'),
      fontSize: 25,
      fontWeight: '700',
    },
    borderColor: 'transparent',
    backButton: {
      showTitle: false,
    },
  },
};

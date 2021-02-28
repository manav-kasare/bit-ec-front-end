import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import {useGlobal} from 'reactn';
import Feather from 'react-native-vector-icons/Feather';
import {push} from '../navigation/functions';
import {storeLanguage} from '../shared/asyncStorage';

export default function Language({componentId}) {
  const [language, setLanguage] = useGlobal('language');

  const handleLanguage = async (code) => {
    setLanguage(code);
    await storeLanguage(code);
  };

  const handleOnPress = () => {
    push(componentId, 'Onboard');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={{marginBottom: constants.height * 0.1}}>
        <Text style={styles.header}>Bit & Ec</Text>
      </View>
      <Text style={styles.heading}>{lang('chooseLanguage')}</Text>

      <View style={{marginVertical: 25}}>
        <TouchableWithoutFeedback onPress={() => handleLanguage('es')}>
          <View
            style={[
              styles.view,
              {backgroundColor: language === 'es' ? 'white' : 'transparent'},
            ]}>
            <Text
              style={{color: language === 'es' ? constants.primary : 'white'}}>
              Español
            </Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => handleLanguage('en')}>
          <View
            style={[
              styles.view,
              {backgroundColor: language !== 'es' ? 'white' : 'transparent'},
            ]}>
            <Text
              style={{color: language !== 'es' ? constants.primary : 'white'}}>
              English
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <TouchableWithoutFeedback onPress={handleOnPress}>
        <View style={styles.chevron}>
          <Feather name="chevron-right" size={25} color="white" />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: constants.primary,
    alignItems: 'center',
  },
  header: {
    fontSize: constants.width * 0.15,
    fontWeight: '800',
    color: 'white',
    marginTop: constants.height * 0.1,
  },
  view: {
    paddingVertical: 10,
    width: constants.width * 0.5,
    borderRadius: 15,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: 'white',
    fontSize: 25,
    fontWeight: '700',
  },
  chevron: {
    marginTop: constants.height * 0.1,
  },
});

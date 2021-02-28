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
      <Text style={styles.heading}>{lang('chooseLanguage')}</Text>

      <View style={{marginVertical: constants.height * 0.1}}>
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
    justifyContent: 'center',
  },
  view: {
    height: 50,
    paddingVertical: 5,
    paddingHorizontal: 25,
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

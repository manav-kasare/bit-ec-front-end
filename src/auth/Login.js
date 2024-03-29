import auth from '@react-native-firebase/auth';
import React from 'react';
import {Keyboard, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import {Button} from 'react-native-paper';
import countries from '../assets/countries.json';
import {push, showOverlay, showToast} from '../navigation/functions';
import CountryPicker from './CountryPicker';
import PhoneInput from './PhoneInput';

export default function Login({componentId}) {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [country, setCountry] = React.useState(RNLocalize.getCountry());
  const [countryCode, setCountryCode] = React.useState(
    countries[RNLocalize.getCountry()].callingCode[0],
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const onChangePhonenumber = (text) => setPhoneNumber(text);
  const handleOnPress = () => {
    showOverlay('CustomModal', {
      height: constants.height * 0.75,
      backgroundColor: 'white',
      children: () => <CountryPicker setCountry={setCountry} />,
    });
  };

  const handleSubmit = async () => {
    let _phoneNumber = phoneNumber;
    if (phoneNumber.substr(0, 1) !== '+') {
      _phoneNumber = '+' + countryCode + phoneNumber.replace(/\s/g, '');
    }
    setIsLoading(true);
    Keyboard.dismiss();
    try {
      await auth()
        .signInWithPhoneNumber(_phoneNumber)
        .then((confirmation) => {
          push(componentId, 'VerifyOtp', {
            confirmation,
            phoneNumber: _phoneNumber,
            type: 'login',
          });
          setIsLoading(false);
        });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      if (err.code === 'auth/invalid-phone-number') {
        showToast('error', 'Invalid Phone number');
      } else if (err.code === 'auth/too-many-requests') {
        showToast('error', 'Too many attempts, try again after some time');
      } else {
        showToast('error', 'An unexpected error occured');
      }
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headingView}>
          <Text style={styles.heading}>{lang('login')}</Text>
        </View>
        <PhoneInput
          handleOnPress={handleOnPress}
          phoneNumber={phoneNumber}
          onChangePhonenumber={onChangePhonenumber}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          country={country}
          setCountry={setCountry}
        />
        <Button
          color={constants.primary}
          labelStyle={{textTransform: 'none', color: 'white'}}
          mode="outlined"
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
          contentStyle={styles.buttonContentStyle}
          onPress={handleSubmit}>
          {lang('submit')}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: constants.width,
    height: constants.height,
    backgroundColor: constants.primary,
    justifyContent: 'space-around',
  },
  headingView: {
    marginBottom: constants.height * 0.025,
  },
  heading: {
    fontSize: constants.width * 0.075,
    fontWeight: '900',
    color: 'white',
  },
  container: {
    flex: 1,
    marginVertical: constants.height * 0.05,
    marginHorizontal: constants.width * 0.1,
    alignSelf: 'center',
  },
  textInput: {
    width: constants.width * 0.8,
    marginVertical: 10,
    height: constants.height * 0.06,
    // backgroundColor: 'white',
  },
  button: {
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: constants.accent,
  },
  buttonContentStyle: {
    width: constants.width * 0.8,
    height: constants.height * 0.06,
  },
});

Login.options = {
  topBar: {
    title: {
      text: '',
    },
    borderColor: 'transparent',
    backButton: {
      showTitle: false,
    },
  },
};

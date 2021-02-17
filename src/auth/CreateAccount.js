import auth from '@react-native-firebase/auth';
import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import {Button, Provider, TextInput} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import countries from '../assets/countries.json';
import CountryPicker from './CountryPicker';
import PhoneInput from './PhoneInput';

export default function CreateAccount({navigation}) {
  const [name, setName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [country, setCountry] = React.useState(RNLocalize.getCountry());
  const [countryCode, setCountryCode] = React.useState(
    countries[RNLocalize.getCountry()].callingCode[0],
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const onChangeName = (text) => setName(text);
  const onChangePhonenumber = (text) => setPhoneNumber(text);
  const handleOnPress = () => setVisible(true);

  const checkAndHandle = () => {
    if (name === '') {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Please enter your name',
      });
    } else {
      handleSubmit();
    }
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
          navigation.navigate('VerifyOtp', {
            confirmation,
            name,
            phoneNumber,
            type: 'create',
          });
          setIsLoading(false);
        });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      if (err.code === 'auth/invalid-phone-number') {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Invalid Phone number',
        });
      } else if (err.code === 'auth/too-many-requests') {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Too many attempts, try again after some time',
        });
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'An unexpected error occured',
        });
      }
    }
  };

  return (
    <Provider>
      <SafeAreaView style={styles.screen}>
        <CountryPicker
          visible={visible}
          setVisible={setVisible}
          setCountry={setCountry}
        />
        <View style={styles.container}>
          <View style={styles.headingView}>
            <Text style={styles.heading}>Create your account</Text>
          </View>
          <TextInput
            mode="outlined"
            label="Your name"
            value={name}
            onChangeText={onChangeName}
            selectionColor={constants.primary}
            underlineColor={constants.primary}
            style={styles.textInput}
          />
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
            loading={isLoading}
            disabled={isLoading}
            labelStyle={{textTransform: 'none'}}
            mode="outlined"
            style={styles.button}
            contentStyle={styles.buttonContentStyle}
            onPress={checkAndHandle}>
            Submit
          </Button>
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: constants.width,
    height: constants.height,
    backgroundColor: 'white',
    justifyContent: 'space-around',
  },
  headingView: {
    marginBottom: constants.height * 0.025,
  },
  heading: {
    fontSize: constants.width * 0.075,
    fontWeight: '900',
    color: 'black',
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
  },
  buttonContentStyle: {
    width: constants.width * 0.8,
    height: constants.height * 0.06,
  },
});

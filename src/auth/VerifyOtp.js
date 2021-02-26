import auth from '@react-native-firebase/auth';
import React from 'react';
import {Keyboard, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import OtpInputs from 'react-native-otp-inputs';
import {Button} from 'react-native-paper';
import {useGlobal} from 'reactn';
import {storeToken, storeUser} from '../shared/asyncStorage';
import {webSocket} from '../sockets';
import {setMain} from '../navigation/navStart';
import messaging from '@react-native-firebase/messaging';
import {showToast} from '../navigation/functions';

export default function VerifyOtp({name, phoneNumber, confirmation, type}) {
  const [code, setCode] = React.useState('');
  const [_confirmation, setConfirmation] = React.useState(confirmation);
  const [isLoadingCode, setIsLoadingCode] = React.useState(false);
  const [isLoadingResendCode, setIsLoadingResendCode] = React.useState(false);
  const [user, setUser] = useGlobal('user');
  const [token, setToken] = useGlobal('token');

  const checkAndHandle = () => {
    Keyboard.dismiss();
    setIsLoadingCode(true);
    _confirmation
      .confirm(code)
      .then(async () => {
        try {
          if (type === 'create') {
            handleCreateUser();
          } else {
            handleLogin();
          }
        } catch (error) {
          showToast('error', 'An unexpected error occured');
          setIsLoadingCode(false);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.code === 'auth/invalid-verification-code') {
          showToast('error', 'Invalid Code');
        } else if (err.code === 'auth/code-expired') {
          showToast('error', 'Code has expired');
        } else {
          showToast('error', 'An unexpected error occured');
        }
        setIsLoadingCode(false);
      });
  };

  const handleCreateUser = async () => {
    const fcmToken = await messaging().getToken();
    const response = await webSocket.createUser({
      notificationId: fcmToken,
      name,
      phoneNumber,
    });
    if (response.err) showToast(response.err);
    else {
      setUser(response.user);
      setToken(response.token);
      storeUser(response.user);
      storeToken(response.token);
      setMain(phoneNumber);
    }
    setIsLoadingCode(false);
  };

  const handleLogin = async () => {
    const response = await webSocket.loginUser(phoneNumber);
    console.log(response);
    if (response.err) showToast('error', response.err);
    else {
      setUser(response.user);
      setToken(response.token);
      storeUser(response.user);
      storeToken(response.token);
      setMain(phoneNumber);
    }
    setIsLoadingCode(false);
  };

  const resendConfirmationCode = async () => {
    console.log(phoneNumber);
    setIsLoadingResendCode(true);
    await auth()
      .signInWithPhoneNumber(phoneNumber)
      .then((response) => {
        setConfirmation(response);
        setIsLoadingResendCode(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoadingResendCode(false);
      });
  };

  const onChangeText = (text) => setCode(text);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headingView}>
          <Text style={styles.heading}>Enter the code</Text>
        </View>
        <View style={styles.inputContainer}>
          <OtpInputs
            handleChange={onChangeText}
            numberOfInputs={6}
            inputStyles={styles.singleView}
            placeholder="0"
            placeholderTextColor="grey"
          />
        </View>
        <Button
          color={constants.accent}
          loading={isLoadingCode}
          disabled={isLoadingCode}
          labelStyle={{textTransform: 'none', color: 'white'}}
          mode="outlined"
          style={{
            borderRadius: 10,
            marginVertical: 10,
            backgroundColor: constants.accent,
          }}
          contentStyle={styles.buttonContentStyle}
          onPress={checkAndHandle}>
          Submit
        </Button>
        <Button
          color="white"
          loading={isLoadingResendCode}
          disabled={isLoadingResendCode}
          labelStyle={{textTransform: 'none', color: 'white'}}
          mode="outlined"
          style={styles.button}
          contentStyle={styles.buttonContentStyle}
          onPress={resendConfirmationCode}>
          Resend code
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
  singleView: {
    width: constants.width * 0.1,
    fontSize: 35,
    color: 'white',
  },
  headingView: {
    marginBottom: constants.height * 0.025,
  },
  heading: {
    fontSize: constants.width * 0.05,
    fontWeight: '900',
    color: 'white',
  },
  container: {
    flex: 1,
    marginVertical: constants.height * 0.05,
    marginHorizontal: constants.width * 0.1,
    alignSelf: 'center',
  },
  inputContainer: {
    height: 50,
    width: constants.width * 0.8,
    marginBottom: 25,
  },
  button: {
    borderRadius: 10,
    marginVertical: 10,
    borderColor: 'white',
  },
  buttonContentStyle: {
    width: constants.width * 0.8,
    height: constants.height * 0.06,
  },
});

VerifyOtp.options = {
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

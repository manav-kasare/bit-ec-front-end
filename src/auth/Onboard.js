import React from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';

export default function Onboard({navigation}) {
  const handleCreateAccount = () => {
    navigation.navigate('CreateAccount');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View>
        <Text style={styles.header}>Bit & Ec</Text>
      </View>
      <View style={styles.bottom}>
        <Button
          color={constants.accent}
          labelStyle={{textTransform: 'none'}}
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContentStyle}
          onPress={handleCreateAccount}>
          Create Account
        </Button>
        <Button
          color="white"
          labelStyle={{textTransform: 'none'}}
          mode="outlined"
          style={styles.button}
          contentStyle={styles.buttonContentStyle}
          onPress={handleLogin}>
          Login
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: constants.width * 0.15,
    fontWeight: '800',
    color: 'white',
    marginTop: constants.height * 0.1,
  },
  bottom: {
    marginBottom: constants.height * 0.05,
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

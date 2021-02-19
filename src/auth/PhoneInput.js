import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import countries from '../assets/countries.json';
import flags from '../assets/flags.json';
import {TextInput} from 'react-native-paper';

export default function PhoneInput({
  handleOnPress,
  countryCode,
  setCountryCode,
  country,
  phoneNumber,
  onChangePhonenumber,
}) {
  const [flag, setFlag] = React.useState(null);

  React.useEffect(() => {
    const flagCode = countries[country].flag;
    setFlag(flags[flagCode]);
    setCountryCode(countries[country].callingCode[0]);
  }, [country]);

  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={styles.flagView}
        onPress={handleOnPress}
        underlayColor="rgba(0,0,0,0.3)">
        <Text style={styles.flag}>{flag}</Text>
      </TouchableHighlight>
      <Text style={styles.dialingCode}>+{countryCode}</Text>
      <TextInput
        mode="flat"
        style={styles.input}
        value={phoneNumber}
        theme={{
          colors: {primary: 'transparent', text: 'white'},
        }}
        selectionColor="rgba(255,255,255,0.2)"
        underlineColorAndroid="transparent"
        underlineColor="transparent"
        keyboardType="number-pad"
        textContentType="telephoneNumber"
        placeholder="Phone Number"
        placeholderTextColor="grey"
        onChangeText={onChangePhonenumber}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: constants.height * 0.065,
    width: constants.width * 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 0,
    borderRadius: 10,
    borderColor: 'grey',
    marginVertical: 10,
  },
  flagView: {
    paddingHorizontal: 5,
    height: constants.height * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: 'transparent',
  },
  flag: {
    fontSize: 25,
  },
  dialingCode: {
    color: 'white',
    marginLeft: 5,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: constants.height * 0.06,
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: 'transparent',
  },
});

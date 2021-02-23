import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Button, TextInput} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import {useGlobal} from 'reactn';
import {push} from '../../navigation/functions';
import {storeUser} from '../../shared/asyncStorage';
import {webSocket} from '../../sockets';

export default function BuyModal({componentId, priceNow}) {
  const [value, setValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [overlayId] = useGlobal('overlayId');
  const [user, setUser] = useGlobal('user');

  const onDismiss = () => {
    Navigation.dismissOverlay(overlayId);
  };
  const onChangeValue = (text) => setValue(text);

  const handleSubmit = async () => {
    setIsLoading(true);
    const response = await webSocket.buy({
      userId: user._id,
      numberOfBitcoins: value / priceNow,
      atPrice: priceNow,
    });
    setUser(response.user);
    setIsLoading(false);
    Navigation.dismissOverlay(overlayId);
    push(componentId, 'Chat', {
      transactionId: response.transactionId,
      prevMessages: [],
    });
    storeUser(response.user);
  };

  return (
    <View style={styles.modal}>
      <TouchableOpacity onPress={onDismiss} style={styles.x}>
        <Feather name="x" size={25} color="white" />
      </TouchableOpacity>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Buy</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.textInput}>
          <Text style={styles.dollar}>$</Text>
          <TextInput
            autoFocus={true}
            theme={{
              colors: {
                primary: 'transparent',
                text: 'white',
                background: 'transparent',
              },
            }}
            selectionColor="white"
            underlineColorAndroid="transparent"
            underlineColor="transparent"
            keyboardType="number-pad"
            mode="flat"
            placeholder="0"
            value={value}
            style={styles.textInputMain}
            onChangeText={onChangeValue}
            placeholderTextColor="grey"
          />
        </View>
      </View>
      <View style={styles.extras}>
        <View style={styles.tile}>
          <Text style={styles.tileText}>Price</Text>
          <Text style={styles.tileText}>$ {priceNow}</Text>
        </View>
        <View style={styles.tile}>
          <Text style={styles.tileText}>Amount</Text>
          <Text style={styles.tileText}>
            {parseFloat(value) / priceNow - 0.0001 > 0
              ? `${(parseFloat(value) / priceNow - 0.0001)
                  .toString()
                  .slice(0, -10)} `
              : '0 '}
            BTC
          </Text>
        </View>
        <View style={styles.tile}>
          <Text style={styles.tileText}>Surcharge</Text>
          <Text style={styles.tileText}>5 %</Text>
        </View>
        <View style={styles.tile}>
          <Text style={styles.tileText}>Payable</Text>
          <Text style={styles.tileText}>
            {(parseFloat(value) * 1.05).toString()}
          </Text>
        </View>
      </View>
      <Button
        loading={isLoading}
        disabled={isLoading}
        labelStyle={{textTransform: 'none', color: 'white'}}
        mode="outlined"
        style={styles.button}
        contentStyle={styles.buttonContentStyle}
        onPress={handleSubmit}>
        Buy
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: constants.width,
    height: constants.height,
    backgroundColor: constants.primary,
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: -constants.height * 0.05,
    left: 0,
    right: 0,
    margin: 0,
  },
  x: {
    position: 'absolute',
    right: 25,
    top: constants.height * 0.025,
  },
  headingContainer: {
    marginTop: constants.height * 0.1,
    width: constants.width,
    alignItems: 'center',
  },
  heading: {
    color: 'white',
    fontWeight: '700',
    fontSize: 45,
    fontVariant: ['tabular-nums'],
  },
  content: {
    marginVertical: constants.height * 0.05,
    alignItems: 'center',
  },
  dollar: {
    color: 'white',
    fontWeight: '700',
    fontSize: 40,
    marginRight: -8,
  },
  textInput: {
    flexDirection: 'row',
    width: constants.width * 0.8,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: constants.height * 0.06,
    borderRadius: 10,
    borderWidth: 0,
  },
  textInputMain: {
    alignContent: 'center',
    textAlign: 'center',
    fontSize: 40,
    margin: 0,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  extras: {
    marginBottom: constants.height * 0.05,
  },
  tile: {
    width: constants.width * 0.9,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  tileText: {
    fontWeight: '600',
    color: 'white',
    fontSize: 25,
    fontVariant: ['tabular-nums'],
  },
  button: {
    borderRadius: 10,
    marginVertical: 10,
    borderColor: 'white',
    width: constants.width * 0.5,
    alignSelf: 'center',
  },
  buttonContentStyle: {
    width: constants.width * 0.5,
    height: constants.height * 0.05,
  },
});

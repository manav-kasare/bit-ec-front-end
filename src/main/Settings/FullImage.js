import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Navigation} from 'react-native-navigation';
import Feather from 'react-native-vector-icons/Feather';

export default function FullImage({uri, componentId}) {
  const onPress = () => {
    Navigation.dismissOverlay(componentId);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <TouchableOpacity style={styles.cross} onPress={onPress}>
        <Feather name="x" color="white" size={25} />
      </TouchableOpacity>
      <FastImage
        source={{uri, priority: FastImage.priority.normal}}
        style={styles.image}
        resizeMode={FastImage.resizeMode.contain}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cross: {
    position: 'absolute',
    right: 10,
    top: 50,
  },
  image: {
    width: constants.width,
    height: constants.height * 0.8,
  },
});

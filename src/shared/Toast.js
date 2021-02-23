import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Navigation} from 'react-native-navigation';
import Animated, {SpringUtils} from 'react-native-reanimated';
import {
  mix,
  useSpringTransition,
  useTransition,
  useValue,
} from 'react-native-redash';

export default function Toast({componentId, feedbackType, message}) {
  const opacityVal = useValue(1);
  const opacityT = useTransition(opacityVal);
  const opacity = mix(opacityT, 0, 1);
  const yT = useSpringTransition(opacityVal, {
    ...SpringUtils.makeDefaultConfig(),
    damping: useValue(20),
  });

  const translateY = mix(yT, 50, 0);

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      flexDirection: 'column-reverse',
    },
    toast: {
      elevation: 2,
      flexDirection: 'row',
      height: 50,
      margin: 16,
      marginBottom: 100,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: 'red',
      justifyContent: 'space-between',
      position: 'absolute',
      width: constants.width * 0.9,
      alignSelf: 'center',
      bottom: constants.height * 0.025,
    },
    text: {
      color: 'white',
      fontSize: 16,
      marginLeft: 16,
    },
    button: {
      marginRight: 16,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  React.useEffect(() => {
    setTimeout(() => {
      Navigation.dismissOverlay(componentId);
    }, 5000);
  }, []);

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor:
            feedbackType === 'success'
              ? '#228b22'
              : feedbackType === 'error'
              ? 'crimson'
              : feedbackType === 'info' && '#03449e',
          opacity,
          transform: [{translateY}],
        },
      ]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

Toast.options = {
  layout: {
    componentBackgroundColor: 'transparent',
  },
  overlay: {
    interceptTouchOutside: false,
  },
};

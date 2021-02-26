import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Navigation} from 'react-native-navigation';
import Animated, {
  cond,
  eq,
  set,
  SpringUtils,
  useCode,
} from 'react-native-reanimated';
import {mix, useSpringTransition, useValue} from 'react-native-redash';

export default function CustomAlert({componentId, title, description}) {
  const y = useValue(0);
  const yT = useSpringTransition(y, {
    damping: useValue(20),
    ...SpringUtils.makeDefaultConfig(),
  });
  useCode(() => cond(eq(y, 0), set(y, 1)), [y]);
  const translateY = mix(yT, 0, constants.height * 0.05);

  React.useEffect(() => {
    setTimeout(() => {
      Navigation.dismissOverlay(componentId);
    }, 3000);
  }, []);

  return (
    <Animated.View
      style={[
        styles.alert,
        {
          transform: [{translateY}],
        },
      ]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </Animated.View>
  );
}

CustomAlert.options = {
  layout: {
    componentBackgroundColor: 'transparent',
  },
  overlay: {
    interceptTouchOutside: false,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
  },
  alert: {
    elevation: 2,
    paddingVertical: 10,
    borderRadius: 5,
    paddingLeft: 15,
    width: constants.width * 0.9,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: constants.accent,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    color: 'white',
    fontSize: 16,
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

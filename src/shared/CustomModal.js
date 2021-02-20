import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useGlobal} from 'reactn';
import Animated, {
  call,
  cond,
  eq,
  set,
  SpringUtils,
  useCode,
} from 'react-native-reanimated';
import {
  mix,
  onGestureEvent,
  useValue,
  withSpringTransition,
} from 'react-native-redash';
import {State, TapGestureHandler} from 'react-native-gesture-handler';
import {Navigation} from 'react-native-navigation';

export default function CustomModal({
  componentId,
  children,
  height,
  backgroundColor,
}) {
  const setOverlayId = useGlobal('overlayId')[1];

  React.useEffect(() => {
    setOverlayId(componentId);
  }, []);

  // Transition
  const open = useValue(1);
  const state = useValue(State.UNDETERMINED);
  const gestureHandler = onGestureEvent({state});
  const yT = withSpringTransition(open, {
    ...SpringUtils.makeDefaultConfig(),
    overshootClamping: true,
    damping: useValue(20),
  });
  const translateY = mix(yT, height, 0);
  useCode(
    () => cond(eq(state, State.END), [set(open, 0), call([], hideModal)]),
    [state],
  );

  const hideModal = () => {
    setTimeout(() => {
      Navigation.dismissOverlay(componentId);
    }, 400);
  };

  const styles = StyleSheet.create({
    backDrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal: {
      width: constants.width,
      backgroundColor: backgroundColor ? backgroundColor : constants.modal,
      height,
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      elevation: 2,
      paddingTop: 20,
    },
    topView: {
      backgroundColor: 'grey',
      height: 3,
      width: 50,
      alignSelf: 'center',
      borderRadius: 10,
      position: 'absolute',
      top: 10,
    },
  });

  return (
    <>
      <TapGestureHandler {...gestureHandler}>
        <Animated.View style={[styles.backDrop, {opacity: open}]} />
      </TapGestureHandler>
      <Animated.View style={[styles.modal, {transform: [{translateY}]}]}>
        <View style={styles.topView} />
        {children()}
      </Animated.View>
    </>
  );
}

CustomModal.options = {
  layout: {
    componentBackgroundColor: 'transparent',
  },
  overlay: {
    interceptTouchOutside: true,
  },
};

import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import Animated, {SpringUtils} from 'react-native-reanimated';
import {mix, useValue, withSpringTransition} from 'react-native-redash';
import {useGlobal} from 'reactn';

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
  const yT = withSpringTransition(open, {
    ...SpringUtils.makeDefaultConfig(),
    overshootClamping: true,
    damping: useValue(20),
  });
  const translateY = mix(yT, height, 0);

  const hideModal = () => {
    open.setValue(0);
    setTimeout(() => {
      Navigation.dismissOverlay(componentId);
    }, 400);
  };

  const styles = StyleSheet.create({
    backDrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
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
      <TouchableWithoutFeedback onPress={hideModal}>
        <Animated.View style={[styles.backDrop, {opacity: open}]} />
      </TouchableWithoutFeedback>

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

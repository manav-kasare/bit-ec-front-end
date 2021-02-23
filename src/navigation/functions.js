import {Navigation} from 'react-native-navigation';

export const push = (componentId, name, passProps) => {
  Navigation.push(componentId, {
    component: {
      name,
      passProps,
    },
  });
};

export const showOverlay = (name, passProps) => {
  Navigation.showOverlay({
    component: {
      name,
      passProps,
    },
  });
};

export const showToast = (type, message) => {
  Navigation.showOverlay({
    component: {
      name: 'Toast',
      passProps: {
        type: 'feedback',
        feedbackType: type,
        message,
      },
    },
  });
};

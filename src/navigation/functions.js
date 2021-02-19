import {Navigation} from 'react-native-navigation';

export const push = (componentId, name, passProps) => {
  Navigation.push(componentId, {
    component: {
      name,
      passProps,
    },
  });
};

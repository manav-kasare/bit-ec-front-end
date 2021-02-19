import App from '../../App';
import {Navigation} from 'react-native-navigation';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';

function registerScreens() {
  Navigation.registerComponent('App', () => App);
  Navigation.registerComponent('Home', () =>
    gestureHandlerRootHOC(require('../main/Home').default),
  );

  Navigation.setLazyComponentRegistrator((componentName) => {
    switch (componentName) {
      case 'Onboard':
        Navigation.registerComponent(
          'Onboard',
          () => require('../auth/Onboard').default,
        );
        break;
      case 'Login':
        Navigation.registerComponent(
          'Login',
          () => require('../auth/Login').default,
        );
        break;
      case 'CreateAccount':
        Navigation.registerComponent(
          'CreateAccount',
          () => require('../auth/CreateAccount').default,
        );
        break;
      case 'VerifyOtp':
        Navigation.registerComponent(
          'VerifyOtp',
          () => require('../auth/VerifyOtp').default,
        );
        break;
      case 'Help':
        Navigation.registerComponent(
          'Help',
          () => require('../main/Help/Help').default,
        );
        break;
    }
  });
}

export {registerScreens};

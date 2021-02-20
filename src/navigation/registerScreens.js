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
      case 'Transaction':
        Navigation.registerComponent(
          'Transaction',
          () => require('../main/Transaction/Transaction').default,
        );
        break;
      case 'Chat':
        Navigation.registerComponent(
          'Chat',
          () => require('../main/Transaction/Chat').default,
        );
        break;
      case 'Admin':
        Navigation.registerComponent(
          'Admin',
          () => require('../main/Transaction/Admin').default,
        );
        break;
      case 'CustomModal':
        Navigation.registerComponent(
          'CustomModal',
          () => require('../shared/CustomModal').default,
        );
        break;
      case 'CustomTopBarButton':
        Navigation.registerComponent(
          'CustomTopBarButton',
          () => require('../shared/CustomTopBarButton').default,
        );
        break;
    }
  });
}

export {registerScreens};

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
      case 'Language':
        Navigation.registerComponent(
          'Language',
          () => require('../auth/Language').default,
        );
        break;
      case 'Login':
        Navigation.registerComponent(
          'Login',
          () => require('../auth/Login').default,
        );
        break;
      case 'Toast':
        Navigation.registerComponent(
          'Toast',
          () => require('../shared/Toast').default,
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
      case 'Settings':
        Navigation.registerComponent(
          'Settings',
          () => require('../main/Settings/Settings').default,
        );
        break;
      case 'LanguageSetting':
        Navigation.registerComponent(
          'LanguageSetting',
          () => require('../main/Settings/LanguageSetting').default,
        );
        break;
      case 'Transactions':
        Navigation.registerComponent(
          'Transactions',
          () => require('../main/Settings/Transactions').default,
        );
        break;
      case 'Trades':
        Navigation.registerComponent(
          'Trades',
          () => require('../main/Settings/Trades').default,
        );
        break;
      case 'Chat':
        Navigation.registerComponent(
          'Chat',
          () => require('../main/Settings/Chat').default,
        );
        break;
      case 'Trade':
        Navigation.registerComponent(
          'Trade',
          () => require('../main/Chart/Trade/Trade').default,
        );
        break;
      case 'Admin':
        Navigation.registerComponent(
          'Admin',
          () => require('../main/Settings/Admin').default,
        );
        break;
      case 'CustomModal':
        Navigation.registerComponent(
          'CustomModal',
          () => require('../shared/CustomModal').default,
        );
        break;
      case 'CustomAlert':
        Navigation.registerComponent(
          'CustomAlert',
          () => require('../shared/CustomAlert').default,
        );
        break;
      case 'CustomTopBarButton':
        Navigation.registerComponent(
          'CustomTopBarButton',
          () => require('../shared/CustomTopBarButton').default,
        );
        break;
      case 'FullImage':
        Navigation.registerComponent(
          'FullImage',
          () => require('../main/Settings/FullImage').default,
        );
        break;
    }
  });
}

export {registerScreens};

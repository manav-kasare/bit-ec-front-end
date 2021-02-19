import {Navigation} from 'react-native-navigation';
import {setGlobalData} from '../shared/reactn';

const animations = {
  push: {
    content: {
      translationX: {
        from: require('react-native').Dimensions.get('window').width,
        to: 0,
        duration: 300,
      },
    },
  },
  pop: {
    content: {
      translationX: {
        from: 0,
        to: require('react-native').Dimensions.get('window').width,
        duration: 300,
      },
    },
  },
};

export const setRoot = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'Onboard',
            },
          },
        ],
        options: {
          animations,
        },
      },
    },
  });
};

export const setMain = async () => {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'BOTTOM_TABS_LAYOUT',
        children: [
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'Home',
                  },
                },
              ],
              //   options: {
              //     bottomTab: {
              //       icon: searchIcon,
              //     },
              //     animations,
              //   },
            },
          },
        ],
      },
    },
  });
};

export const navStart = () => {
  setGlobalData();
  Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
      root: {
        stack: {
          children: [
            {
              component: {
                name: 'App',
              },
            },
          ],
          options: {
            animations,
          },
        },
      },
    });
    setDefaultOptions();
  });
};

export const setDefaultOptions = () => {
  Navigation.setDefaultOptions({
    statusBar: {
      backgroundColor: constants.primary,
    },
    topBar: {
      background: {
        color: constants.primary,
      },
      borderColor: 'transparent',
      backButton: {
        color: 'white',
      },
      title: {
        color: 'white',
      },
      rightButtonColor: 'white',
    },
    bottomTabs: {
      tabsAttachMode: 'afterInitialTab',
      backgroundColor: constants.primary,
      titleDisplayMode: 'alwaysHide',
    },
    bottomTab: {
      selectedIconColor: darkTheme ? 'white' : '#03449e',
      iconColor: 'grey',
      selectedFontSize: 24,
      fontSize: 24,
    },
  });
  setMain();
};

import React from 'react';
import Navigator from './src/navigators';
import {TokenContextProvider, UserContextProvider} from './src/shared/context';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import Toast from 'react-native-toast-message';

const theme = {
  ...DefaultTheme,
  roundness: 10,
  colors: {
    ...DefaultTheme.colors,
    primary: 'transparent',
    accent: constants.accent,
    text: 'black',
  },
  dark: false,
};

export default function App() {
  return (
    <>
      <PaperProvider theme={theme}>
        <TokenContextProvider>
          <UserContextProvider>
            <Navigator />
          </UserContextProvider>
        </TokenContextProvider>
      </PaperProvider>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
}

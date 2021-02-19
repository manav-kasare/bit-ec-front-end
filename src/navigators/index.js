import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import CreateAccount from '../auth/CreateAccount';
import Login from '../auth/Login';
import Onboard from '../auth/Onboard';
import VerifyOtp from '../auth/VerifyOtp';
import Home from '../main/Home';
import {getToken} from '../shared/asyncStorage';

const config = {
  animation: 'spring',
  config: {
    stiffness: 500,
    damping: 10000,
    mass: 2,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const MainStack = createStackNavigator();
const AuthStack = createStackNavigator();

export default function Navigator() {
  const [token, setToken] = React.useState(null);

  React.useEffect(() => {
    handleGetToken();
  }, []);

  const handleGetToken = async () => {
    const _token = await getToken();
    setToken(_token);
  };

  return (
    <NavigationContainer>
      {token ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Onboard"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: config,
          close: config,
        },
        headerStyle: {
          shadowOpacity: 0,
          borderWidth: 0,
          backgroundColor: constants.primary,
        },
        headerTintColor: 'white',
      }}>
      <AuthStack.Screen
        name="Onboard"
        component={Onboard}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="CreateAccount"
        component={CreateAccount}
        options={{
          headerBackTitleVisible: false,
          headerTitle: null,
        }}
      />
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{
          headerBackTitleVisible: false,
          headerTitle: null,
        }}
      />
      <AuthStack.Screen
        name="VerifyOtp"
        component={VerifyOtp}
        options={{
          headerBackTitleVisible: false,
          headerTitle: null,
        }}
      />
    </AuthStack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <MainStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: config,
          close: config,
        },
        headerStyle: {
          shadowOpacity: 0,
          borderWidth: 0,
        },
        headerTintColor: 'black',
      }}>
      <MainStack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
    </MainStack.Navigator>
  );
};

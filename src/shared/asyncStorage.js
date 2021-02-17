import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUser = async (user) => {
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const getUser = async () => {
  const user = AsyncStorage.getItem('user');
  return JSON.parse(user);
};

export const storeToken = async (token) => {
  await AsyncStorage.setItem('token', token);
};

export const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};

import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUser = async (user) => {
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const getUser = async () => {
  const user = await AsyncStorage.getItem('user');
  return JSON.parse(user);
};

export const storeToken = async (token) => {
  await AsyncStorage.setItem('token', token);
};

export const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};

export const storeMessages = async (messages) => {
  await AsyncStorage.setItem('messages', JSON.stringify({messages}));
};

export const getMessages = async () => {
  const messages = await AsyncStorage.getItem('messages');
  if (message) return JSON.parse(messages).messages;
  else return null;
};

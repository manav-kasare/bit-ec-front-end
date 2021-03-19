import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUser = async (user) => {
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const getUser = async () => {
  const user = await AsyncStorage.getItem('user');
  return JSON.parse(user);
};

export const removeUser = async () => {
  await AsyncStorage.removeItem('user');
};

export const storeToken = async (token) => {
  await AsyncStorage.setItem('token', token);
};

export const removeToken = async () => {
  await AsyncStorage.removeItem('token');
};

export const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};

export const storeLanguage = async (language) => {
  await AsyncStorage.setItem('language', language);
};

export const getLanguage = async () => {
  const language = await AsyncStorage.getItem('language');
  if (language) return language;
  else return null;
};

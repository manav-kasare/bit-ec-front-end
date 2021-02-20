import {setGlobal} from 'reactn';

export const setGlobalData = () => {
  const user = {
    _id: '',
    name: '',
    bitcoinsBought: 0,
    lastPrice: 0,
    transactions: [],
  };
  setGlobal({
    user: user,
    token: null,
    overlayId: null,
    isAdmin: false,
  });
};

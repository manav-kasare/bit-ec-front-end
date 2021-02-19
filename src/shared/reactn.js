import {setGlobal} from 'reactn';

export const setGlobalData = () => {
  const user = {
    name: 'Manav Kasare',
    bitcoinsBought: 100,
    lastPrice: 50000,
  };
  setGlobal({
    user: user,
    token: null,
  });
};

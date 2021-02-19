import React from 'react';

export const UserContext = React.createContext(null);

export const UserContextProvider = ({children}) => {
  const [user, setUser] = React.useState({
    name: 'Manav Kasare',
    bitcoinsBought: 100,
    lastPrice: 50000,
  });
  // const [user, setUser] = React.useState(null);
  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const TokenContext = React.createContext(null);

export const TokenContextProvider = ({children}) => {
  const [token, setToken] = React.useState(null);
  return (
    <TokenContext.Provider value={{token, setToken}}>
      {children}
    </TokenContext.Provider>
  );
};

import React from 'react';
import {useGlobal} from 'reactn';
import {navStart, setMain, setRoot} from './src/navigation/navStart';
import {getToken, getUser} from './src/shared/asyncStorage';
import {webSocket} from './src/sockets';

export default function App() {
  const setToken = useGlobal('token')[1];
  const setUser = useGlobal('user')[1];
  const setIsAdmin = useGlobal('isAdmin')[1];

  React.useEffect(() => {
    webSocket.init();
    handleGetToken();
  }, []);

  const handleGetToken = async () => {
    const asyncToken = await getToken();
    setToken(asyncToken);
    if (asyncToken) {
      const user = await getUser();
      setMain(user.phoneNumber);
      setUser(user);
      if (user.phoneNumber === '+593983873813') setIsAdmin(true);
      if (user) {
        const response = await webSocket.getUserByToken(asyncToken);
        if (!response.err) {
          if (response.user.phoneNumber === '+593983873813') setIsAdmin(true);
          setUser(response.user);
        }
      }
    } else {
      setRoot();
    }
  };

  return <></>;
}

async function start() {
  navStart();
}

export {start};

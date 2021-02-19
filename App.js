import React from 'react';
import {useGlobal} from 'reactn';
import {navStart, setMain, setRoot} from './src/navigation/navStart';
import {getToken} from './src/shared/asyncStorage';

export default function App() {
  const setToken = useGlobal('token')[1];

  React.useEffect(() => {
    getToken().then((asyncToken) => {
      if (!asyncToken) {
        setMain();
        setToken(asyncToken);
      } else {
        setRoot();
      }
    });
  }, []);

  return <></>;
}

async function start() {
  navStart();
}

export {start};

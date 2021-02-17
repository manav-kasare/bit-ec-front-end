const socketPromise = require('./socket.io-promise').promise;
import socketIO from 'socket.io-client';

class WebSocket {
  init = () => {
    this.socket = socketIO(`http://192.168.0.101:9090/`, {
      transports: ['websocket'],
      reconnect: true,
      jsonp: false,
    });
    this.socket.request = socketPromise(this.socket);
  };

  createUser = async (data) => {
    const response = await this.socket.request('createUser', data);
    return response;
  };

  getUserByPhone = async (data) => {
    const response = await this.socket.request('getUserByPhone', data);
    return response;
  };
}

export const webSocket = new WebSocket();

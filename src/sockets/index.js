const socketPromise = require('./socket.io-promise').promise;
import socketIO from 'socket.io-client';

class WebSocket {
  constructor() {
    this.socket = null;
  }

  init = () => {
    console.log('connecting');
    this.socket = socketIO(`http://192.168.0.100:9090/`, {
      transports: ['websocket'],
      reconnect: true,
      jsonp: false,
    });

    this.socket.request = socketPromise(this.socket);
  };

  connected = (id) => {
    this.socket.emit('connected', id);
  };

  createUser = async (data) => {
    const response = await this.socket.request('createUser', data);
    return response;
  };

  getUserByPhone = async (data) => {
    const response = await this.socket.request('getUserByPhone', data);
    return response;
  };

  buy = async (data) => {
    const response = await this.socket.request('buy', data);
    return response;
  };

  sell = async (data) => {
    const response = await this.socket.request('sell', data);
    return response;
  };

  sendMessage = (data) => {
    this.socket.emit('sendMessage', data);
  };
}

export const webSocket = new WebSocket();

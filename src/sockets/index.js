const socketPromise = require('./socket.io-promise').promise;
import socketIO from 'socket.io-client';

class WebSocket {
  constructor() {
    this.socket = null;
  }

  init = () => {
    console.log('connecting');
    this.socket = socketIO(`http://192.168.0.102:9090/`, {
      transports: ['websocket'],
      reconnect: true,
      jsonp: true,
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

  loginUser = async (data) => {
    const response = await this.socket.request('loginUser', data);
    return response;
  };

  updateUser = async (token, data) => {
    const response = await this.socket.request('updateUse,', {token, data});
    return response;
  };

  getUserByPhone = async (data) => {
    const response = await this.socket.request('getUserByPhone', data);
    return response;
  };

  getUserByToken = async (token) => {
    const response = await this.socket.request('getUserByToken', token);
    return response;
  };

  getUserById = async (id) => {
    const response = await this.socket.request('getUserById', id);
    return response;
  };

  getAdmin = async () => {
    const response = await this.socket.request('getAdmin');
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

  sendMessageToAdmin = (data) => {
    this.socket.emit('sendMessageToAdmin', data);
  };

  sendChatMsg = (data) => {
    this.socket.emit('sendChatMsg', data);
  };

  getTransaction = async (id) => {
    const response = await this.socket.request('getTransaction', id);
    return response;
  };

  getPendingTransactions = async () => {
    const response = await this.socket.request('getPendingTransactions');
    return response;
  };

  approveTransaction = async (id) => {
    const response = await this.socket.request('approveTransaction', id);
    return response;
  };

  declineTransaction = async (id) => {
    const response = await this.socket.request('declineTransaction', id);
    return response;
  };

  approveTrade = async (id) => {
    const response = await this.socket.request('approveTrade', id);
    return response;
  };

  declineTrade = async (id) => {
    const response = await this.socket.request('declineTrade', id);
    return response;
  };

  addListing = async (id) => {
    const response = await this.socket.request('addListing', id);
    return response;
  };

  getBuyListings = async (data) => {
    const response = await this.socket.request('getBuyListings', data);
    return response;
  };

  getSellListings = async () => {
    const response = await this.socket.request('getSellListings');
    return response;
  };

  getListing = async (id) => {
    const response = await this.socket.request('getListing', id);
    return response;
  };

  trade = async (data) => {
    const response = await this.socket.request('trade', data);
    return response;
  };

  getTrade = async (id) => {
    const response = await this.socket.request('getTrade', id);
    return response;
  };

  getPendingTrades = async () => {
    const response = await this.socket.request('getPendingTrades');
    return response;
  };

  notifyAdmin = async (data) => {
    await this.socket.emit('notifyAdmin', data);
  };
}

export const webSocket = new WebSocket();

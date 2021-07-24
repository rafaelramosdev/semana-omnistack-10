import socketIo from 'socket.io-client';

import { Dev } from '../pages/Main';

const socket = socketIo('', {
  autoConnect: false,
});

export function subscribeToNewDev(subscribeFunction: (dev: Dev) => void) {
  socket.on('new-dev', subscribeFunction);
}

export function connect(latitude: string, longitude: string, techs: string) {
  socket.io.opts.query = {
    latitude,
    longitude,
    techs
  };
  
  socket.connect();
};

export function disconnect() {
  if (socket.connected)
    socket.disconnect();
};